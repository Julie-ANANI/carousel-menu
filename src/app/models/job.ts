export interface Job {
  owner: string;
  innovationId: string;
  jobType: JobType;
  status: 'RECEIVED' | 'QUEUED' | 'PROCESSING' | 'DONE' | 'ERROR';
  step: string;
  lastMessage: {
    message: string;
    code: 200 | 400 | 500;
  };
}

export type JobType = 'PDF_EX_REPORT' | 'PDF_ANSWERS' | 'VIDEO_TEST' | 'VIDEO_FINAL';
