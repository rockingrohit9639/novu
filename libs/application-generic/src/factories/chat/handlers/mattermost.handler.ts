import { ChatProviderIdEnum, ICredentials } from '@novu/shared';
import { ChannelTypeEnum } from '@novu/stateless';
import { BaseChatHandler } from './base.handler';
import { MattermostProvider } from '@novu/providers';

export class MattermostHandler extends BaseChatHandler {
  constructor() {
    super(ChatProviderIdEnum.Mattermost, ChannelTypeEnum.CHAT);
  }

  buildProvider(_credentials: ICredentials) {
    this.provider = new MattermostProvider();
  }
}
