export type EmailValues = {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  attachments: [];
  properties?: Record<string, any>;
  endpoint: string;
};
