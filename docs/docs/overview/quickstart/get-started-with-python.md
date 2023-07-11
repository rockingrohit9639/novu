---
sidebar_position: 10
sidebar_label: Get started with Python
---

# Python Quickstart

Welcome to the Python Quickstart guide for Novu, a powerful notification service that enables you to send multi-channel (SMS, Email, Chat, Push) notifications from your Python applications. In this Quickstart, you'll learn how to seamlessly integrate Novu into your Python project and perform various essential tasks. Let's get started!

## Prerequisites

Before diving into the Quickstart, make sure you have the following:

- Python3 installed on your development machine.
- A Novu account. If you don't have one, sign up for free at [web.novu.co](https://web.novu.co)

You can also [view the completed code](https://web.novu.co) of this quick start in a GitHub repo.

### Install and Set Up Novu in your Python Project

First, you must install the Novu package in your Python project. You can install the Novu package in your project in two ways. Open your terminal and run the following command:

Via pip

```bash
pip install novu
```

Via poetry

```bash
poetry add novu
```

Once installed, you can import Novu into your project and initialize it using your Novu account credentials. This step establishes a connection between your app and the Novu notification service.

```python
from novu.config import NovuConfig

NovuConfig().configure("https://api.novu.co", "<YOUR_NOVU_API_KEY>")
```

Replace the `<YOUR_NOVU_API_KEY>` value with the authentic key from the **API Key** section of your [Novu Dashboard](https://web.novu.co/settings).

<aside>
🔑 Note: Please do not hardcode your credentials in a file in production. Use environment variables instead.

</aside>

## Set Up A Channel Provider

A channel provider is a service that provides one or more notification functionality such as sending an email, SMS, push notification etc. Our [integration store](https://web.novu.co/integrations) includes four channels: Email, SMS, Chat, and Push. These channels have multiple providers associated with them.

| Channel | Providers                                                           |
| ------- | ------------------------------------------------------------------- |
| Email   | MailGun, Mandrill, MailJet, Amazon SES, Sendgrid, Postmark, Netcore |
| SMS     | Twilio, Amazon SNS, Plivo, SMS, SMSCentral, Kannel, Infobip, Termii |
| Chat    | Mattermost, Slack, Microsoft Teams, Discord                         |
| Push    | FCM, APNS, Expo                                                     |

Only one provider can be **active** per **channel**. Connect any of your favorite providers to get started. The email channel comes with Novu's email provider, which is active by default and includes 300 credits.

## Create a Notification Workflow

A notification workflow is the blueprint for the notifications that will be sent. It holds the entire flow of messages sent to the subscriber. This is where all the different channels are tied together under a single entity.

The workflow includes the following:

- Notification workflow name and Identifier
- Channel tailored content:

| Channel | Content Style                                                                                 |
| ------- | --------------------------------------------------------------------------------------------- |
| Email   | 1. Custom Code (HTML) with option to use custom variables via the handlebars , {{ }}, syntax. |
|         | 2. Click and place UI items with the visual template editor.                                  |
| SMS     | Text with the option to use handlebars syntax, {{ }} to inject custom variables.              |
| Chat    | Text with the option to use handlebars syntax, {{ }} to inject custom variables.              |
| In-App  | Text                                                                                          |

Note: Proper authorization needs to be set for the Chat channel for subscribers.

Please proceed to create a notification workflow.

1. Click “Workflows” on the left sidebar of your Novu dashboard.
2. Click the “Create Workflow” button on the top right.
3. The name of a new workflow is currently "Untitled." Rename it to a more suitable title.
4. Select "Email" as the channel you want to add.
   ![set-email.png] (https://res.cloudinary.com/dxc6bnman/image/upload/v1686776583/set-email_wavtrn.png)

5. Click on the recently added channel, fill the email subject and click “Update”.
   ![update_email_template.png](https://res.cloudinary.com/dxc6bnman/image/upload/v1686776583/update_email_template_ivn0jv.png)

6. Click on the “Test” tab and send a test email to verify your notification workflow.
   ![send_test_email.png](https://res.cloudinary.com/dxc6bnman/image/upload/v1686776583/send_test_email_ngzmth.png)

You should get an email within seconds. Yaaay, you have successfully sent your first notification via the Novu dashboard! Now, let’s take it a step further to trigger notifications via code.

## Create A Subscriber

The recipients of a triggered notification are called subscribers.

Click “Subscribers” on the left sidebar of the Novu dashboard to see all subscribers. By default, the dashboard will display a subscriber, as you were added automatically during sign-up.

![subscriber_id.png](https://res.cloudinary.com/dxc6bnman/image/upload/v1688331839/Screenshot_2023-07-03_at_0.02.53_jmkhi3.png)

Now, let's create a subscriber on Novu. Copy and paste the following code to do so:

```python
# Create a subscriber

from novu.api.subscriber import SubscriberApi
from novu.dto.subscriber import SubscriberDto
   
your_subscriber_id = "123"; # Replace this with a unique user ID that matches your database.

subscriber = SubscriberApi("https://api.novu.co", "b23c55928da9e76702b74921a7fffee2")
subscriber.create(SubscriberDto(
        subscriber_id=your_subscriber_id,
        email="abc@gmail.com",
        first_name="John",
        last_name="Doe"
    )
)
```

Run the code in your terminal like so:

```bash
python main.py # replace main.py with your file name
```

You should see the subscriber on your Novu dashboard.

## Update A Subscriber

To update the Subscriber details you can follow you can call the `put` method from `SubcriberApi`. Here is an example:

```python
# Update subscriber detail

from novu.api.subscriber import SubscriberApi
from novu.dto.subscriber import SubscriberDto
subscriber = SubscriberApi("https://api.novu.co", "<YOUR_NOVU_API_KEY>")
subscriber.put(subscriber=SubscriberDto(
        subscriber_id="<You want to update>",
        email="abc@gmail.com",
        first_name="John",
        last_name="Doe"
))
```

Other valid fields that can be updated are `email`, `first_name` etc.

<aside>
Note: To make all of your app users subscribers, you need to programmatically add them to Novu.

</aside>

## Trigger A Notification

Copy and paste the following code into your app to trigger a notification:

```python
from novu.config import NovuConfig
from novu.api import EventApi

NovuConfig().configure("https://api.novu.co", "<NOVU_API_TOKEN>")

EventApi().trigger(
     name="<YOUR_WORKFLOW_TRIGGER_ID>",  # The workflow ID is the slug of the workflow name. It can be found on the workflow page.
    recipients="<YOUR_SUBSCRIBER_ID>",
    payload={},  # Your Novu payload goes here
)
```

Before running the code, make sure you understand the following:

- The value of `notificationWorkflowId` should be the notification workflow's trigger ID/slug.

![trigger_id.png](https://res.cloudinary.com/dxc6bnman/image/upload/v1686776585/trigger_id_xkhsx7.png)

- The value of `payload` is an array of the data that you want to be dynamically injected into the notification template content.
- The value of `subscriberId` is the id of the subscriber on Novu. Replace `7789` with your subscriber ID.

Run the code to trigger a notification!

```bash
python main.py # replace main.py with your file name
```

## Next Steps

Great job! If you've reached this point, you should now have successfully Set up a channel provider, Create a notification workflow, Create a Subscriber, Update a Subscriber, Trigger a Notification in your application.

To learn more about notifications and explore Novu's features and capabilities, check out:

- [Novu Digest Engine](https://docs.novu.co/platform/digest) - Learn how to aggregate multiple trigger events into a single message and deliver it to the subscriber.
- [Novu Notification Center](https://docs.novu.co/notification-center/getting-started) - Learn how to integrate a rich, ready-to-use real-time UI notification center into your app.