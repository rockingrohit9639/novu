import { SubscribersService, UserSession } from '@novu/testing';
import { MessageRepository, NotificationTemplateEntity, SubscriberEntity } from '@novu/dal';
import { expect } from 'chai';
import axios from 'axios';
import { ChannelTypeEnum } from '@novu/shared';

const axiosInstance = axios.create();

describe('Delete Messages By TransactionId - /messages/?transactionId= (DELETE)', function () {
  let session: UserSession;
  const messageRepository = new MessageRepository();
  let template: NotificationTemplateEntity;
  let subscriber: SubscriberEntity;
  let subscriberService: SubscribersService;

  beforeEach(async () => {
    session = new UserSession();
    await session.initialize();
    template = await session.createTemplate();
    subscriberService = new SubscribersService(session.organization._id, session.environment._id);
    subscriber = await subscriberService.createSubscriber();
  });

  it('should fail to delete non existing message', async function () {
    const response = await session.testAgent.delete(`/v1/messages?transactionId=abc-1234`);

    expect(response.statusCode).to.equal(404);
    expect(response.body.error).to.equal('Not Found');
  });

  it('should delete messages by transactionId', async function () {
    await axiosInstance.post(
      `${session.serverUrl}/v1/subscribers`,
      {
        subscriberId: '123456',
        name: 'broadcast subscriber',
      },
      {
        headers: {
          authorization: `ApiKey ${session.apiKey}`,
        },
      }
    );

    const response = await axiosInstance.post(
      `${session.serverUrl}/v1/events/trigger/broadcast`,
      {
        name: template.triggers[0].identifier,
        payload: {
          email: 'new-test-email@gmail.com',
          firstName: 'Testing of User Name',
          urlVar: '/test/url/path',
        },
      },
      {
        headers: {
          authorization: `ApiKey ${session.apiKey}`,
        },
      }
    );

    await session.awaitRunningJobs(template._id);

    const transactionId = response.data.data.transactionId;

    const messages = await messageRepository.find({
      _environmentId: session.environment._id,
      _organizationId: session.organization._id,
      transactionId: transactionId,
    });

    expect(messages.length).to.be.greaterThan(0);

    await axiosInstance.delete(`${session.serverUrl}/v1/messages?transactionId=` + transactionId, {
      headers: {
        authorization: `ApiKey ${session.apiKey}`,
      },
    });

    const result = await messageRepository.find({
      transactionId: transactionId,
      _environmentId: session.environment._id,
      _organizationId: session.organization._id,
    });

    expect(result.length).to.equal(0);
  });

  it('should delete messages by transactionId and channel', async function () {
    const response = await axiosInstance.post(
      `${session.serverUrl}/v1/events/trigger/broadcast`,
      {
        name: template.triggers[0].identifier,
        payload: {
          email: 'new-test-email@gmail.com',
          firstName: 'Testing of User Name',
          urlVar: '/test/url/path',
        },
      },
      {
        headers: {
          authorization: `ApiKey ${session.apiKey}`,
        },
      }
    );

    await session.awaitRunningJobs(template._id);
    const transactionId = response.data.data.transactionId;

    const messages = await messageRepository.find({
      _environmentId: session.environment._id,
      _organizationId: session.organization._id,
      transactionId: transactionId,
      channel: ChannelTypeEnum.EMAIL,
    });

    expect(messages.length).to.be.greaterThan(0);

    await axiosInstance.delete(
      `${session.serverUrl}/v1/messages?transactionId=` + transactionId + '&channel=' + ChannelTypeEnum.EMAIL,
      {
        headers: {
          authorization: `ApiKey ${session.apiKey}`,
        },
      }
    );

    const result = await messageRepository.find({
      transactionId: transactionId,
      _environmentId: session.environment._id,
      _organizationId: session.organization._id,
      channel: ChannelTypeEnum.EMAIL,
    });

    expect(result.length).to.equal(0);
  });
});
