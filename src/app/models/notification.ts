export type NotificationTrigger = 'TRIGGER_CREATE_ACCOUNT' | 'TRIGGER_ADD_TEAMMATES' | 'TRIGGER_CHANGE_OWNER'
  | 'TRIGGER_FIRST_ANSWER' | 'TRIGGER_NEW_ANSWER' | 'TRIGGER_COMPLETE_PROJECT' | 'TRIGGER_COMMENT_SUGGESTION'
  | 'TRIGGER_ASK_VALIDATE_PROJECT' | 'TRIGGER_CONFIRM_VALIDATE_PROJECT' | 'TRIGGER_DOWNLOAD_DOCUMENTS'
  | 'TRIGGER_CLIENT_SATISFACTION';

export type NotificationCronName = 'CRON_ADD_TEAMMATES' | 'CRON_NEW_ANSWER' | 'CRON_COMPLETE_PROJECT';
export type NotificationJobStatus = 'RECEIVED' | 'QUEUED' | 'PROCESSING' | 'DONE' | 'ERROR' | 'CANCELLED';

export interface NotificationJob {
  /**
   * This contains the status of the job. Possible states are:
   *  - 'RECEIVED': the request has been received,
   *  - 'QUEUED': the job has been registered and queued,
   *  - 'PROCESSING': the job has started,
   *  - 'DONE': the job is finished and ready to be downloaded,
   *  - 'ERROR': there's an error detected during the process
   *  - 'CANCELLED': the job is cancelled based on the condition
   */
  status: NotificationJobStatus;

  /**
   * List of the users who will receive the notification
   */
  recipients: [{
    email: string;
    language: string;
    firstName: string;
    recipientId: string;
  }];

  /**
   * saving the copy of whole notification
   */
  notification: Notification;

  /**
   * reference to the user who invoked the route / function of the notification
   * For example: when the ope will ask for Validate Project in that case will
   * store id of that ope.
   * For certain case it can be empty like Add Teammates.
   */
  userRef: string;

  /**
   * reference to the innovation. We need it to check the conditions later in the process.
   */
  innovationRef: string;
}

export interface Notification {
  /**
   * contain the template info of the notification.
   * Every notification should have one
   */
  template: {
    name: string;
    content: [{
      lang: string;
      body: string;
      subject: string;
    }]
  },

  type: 'USER' | 'PROJECT';

  /**
   * every notification should have one trigger and based on that we define the conditions and
   * process it.
   */
  trigger: NotificationTrigger;

  /**
   * certain notification we have to send after certain time period, so we identify
   * them with the cron name and process them accordingly
   */
  cronName: NotificationCronName;

  /**
   * it's the priority in the job queue to decide the order of sending
   * notification. The higher the number, the lower is the priority; We also use it
   * for the mailgun priority.
   */
  jobPriority: number;
}
