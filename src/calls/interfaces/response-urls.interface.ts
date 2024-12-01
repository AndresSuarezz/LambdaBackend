export interface ResponseUrls {
    response_urls: ResponseUrl[];
}

export interface ResponseUrl {
  speaker_id: string;
  type: string;
  text: string;
  start_ts: number;
  stop_ts: number;
}
