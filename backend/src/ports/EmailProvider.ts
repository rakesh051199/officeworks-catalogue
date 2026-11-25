export type EnquiryEmail = {
  to: string;
  from: string;
  subject: string;
  text: string;
};

export interface EmailProvider {
  send(email: EnquiryEmail): Promise<void>;
}
