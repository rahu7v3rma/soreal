import { NextRequest, NextResponse } from "next/server";

export interface MiddlewareRequest extends NextRequest {
  user: {
    id: string;
  };
  parsedRequestBody: any;
  parsedRequestQuery: any;
}

export const withMiddlewares = (
  ...middlewares: ((
    request: MiddlewareRequest,
    params?: any
  ) => Promise<NextResponse<any> | undefined>)[]
) => {
  return async (request: NextRequest, params?: any) => {
    const extendedRequest = request as MiddlewareRequest;
    for (const middleware of middlewares) {
      const response = await middleware(extendedRequest, params);
      if (response) return response;
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  };
};
