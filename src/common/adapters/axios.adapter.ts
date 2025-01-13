import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interface/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async post<T>(url: string, body: any, config: any): Promise<T> {
    try {
      const { data } = await this.axios.post<T>(url, body, config);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
