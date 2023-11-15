export const Constants = {
    API: 'api',
    API_VERSION_1: '1',
    API_VERSION_2: '2',
    API_VERSION_3: '3',
    BAD_REQ: 'Bad request',
    UNAUTH_REQ: 'Unauthorized',
    NOT_FOUND: 'Not found',
    CREATE_FAILED: 'Create failed',
    UPDATE_FAILED: 'Update failed',
    DELETE_FAILED: 'Delete failed',
    GENERIC_ERROR: 'An error occurred',
    CURRENT_PASSWORD_NOT_MATCH: 'Current password not match',
    DUPLICATE_FOUND: 'Duplicate data found',
    JWT_SECRET: 'com.domain',
    HTTP_200: 200, // Ok
    HTTP_201: 201, // Created
    HTTP_400: 400, // Bad request
    HTTP_401: 401, // Unauthorized
    HTTP_403: 403, // Forbidden
    HTTP_404: 404, // Not found
    HTTP_500: 500, // Internal server error
} as const;