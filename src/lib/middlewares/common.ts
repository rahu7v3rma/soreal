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
    request: MiddlewareRequest
  ) => Promise<NextResponse<any> | undefined>)[]
) => {
  return async (request: NextRequest) => {
    const extendedRequest = request as MiddlewareRequest;
    for (const middleware of middlewares) {
      const response = await middleware(extendedRequest);
      if (response) return response;
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  };
};
