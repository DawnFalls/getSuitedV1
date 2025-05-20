export interface InterviewDetails {
    position: string;
    workType: string;
    seniority: string;
    companyName: string;
    workModel: string;
  }
  
  export interface EvaluationResult {
    question: string;
    codeAnswer?: string;
    codeScore?: number;
    feedback?: string;
    transcript?: string;
    confidence?: number;
    bodyLanguage?: {
      smilingScore: number;
      eyeContact: boolean;
      emotion: string;
    };
  }