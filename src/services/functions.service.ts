import { ExecutionMethod } from 'appwrite';
import { functions } from '../lib/appwrite/client';
import { APPWRITE_CONFIG, isAppwriteReady } from '../lib/appwrite/config';
import { ServiceResponse } from '../types/appwrite.types';

/**
 * ============================================================================
 * ATC Cloud Functions Service (Appwrite Functions)
 * ============================================================================
 * Dispatches serverless function executions for sensitive backend operations.
 */
export class FunctionsService {
  /**
   * Dispatches a cloud function execution with JSON payload
   */
  static async executeFunction<T = any>(
    functionId: string,
    body: Record<string, any> = {},
    asyncExecution = false
  ): Promise<ServiceResponse<T>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const execution = await functions.createExecution(
        functionId,
        JSON.stringify(body),
        asyncExecution,
        '/',
        ExecutionMethod.POST,
        { 'Content-Type': 'application/json' }
      );

      if (execution.status === 'failed') {
        return {
          success: false,
          error: execution.errors || 'Function execution failed on server.',
        };
      }

      let parsedResponseBody: T | undefined;
      try {
        parsedResponseBody = JSON.parse(execution.responseBody);
      } catch {
        parsedResponseBody = execution.responseBody as unknown as T;
      }

      return { success: true, data: parsedResponseBody };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to trigger cloud function.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Triggers the ticket generator cloud function
   */
  static async triggerTicketGeneration(registrationId: string) {
    return this.executeFunction(
      APPWRITE_CONFIG.FUNCTIONS.TICKET_GENERATOR,
      { registrationId }
    );
  }

  /**
   * Triggers the email notification cloud function
   */
  static async triggerEmailNotification(params: {
    to: string;
    template: string;
    data: Record<string, any>;
  }) {
    return this.executeFunction(
      APPWRITE_CONFIG.FUNCTIONS.EMAIL_NOTIFIER,
      params
    );
  }
}
