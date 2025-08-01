"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiEndpoints } from "@/constants/api-docs/api-reference/get-images";

const Page = () => {
  return (
    <div className="space-y-8 py-16">
      <div className="container max-w-6xl mx-auto px-4 space-y-12">
        <section className="space-y-6" id="api-reference">
          <h2 className="text-3xl font-bold tracking-tight">API Reference</h2>

          <div className="space-y-6">
            {apiEndpoints.map((endpoint, index) => (
              <Card
                key={index}
                id={`endpoint-${index}`}
                className="scroll-mt-8"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{endpoint.name}</CardTitle>
                    <Badge
                      className={
                        endpoint.method === "POST"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }
                    >
                      {endpoint.method}
                    </Badge>
                  </div>
                  <CardDescription>{endpoint.endpoint}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p>{endpoint.description}</p>
                    {endpoint.limits.credits > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        This endpoint requires {endpoint.limits.credits} credits
                        per call.
                      </p>
                    )}
                  </div>

                  {endpoint.parameters.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Parameters</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Required</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                      </Table>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Example Request Headers
                    </h3>
                    <pre className="bg-muted p-3 rounded-md font-mono text-sm overflow-auto">
{`{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Example Response
                    </h3>
                    <pre className="bg-muted p-3 rounded-md font-mono text-sm overflow-auto">
                      {endpoint.response}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Error Codes</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status Code</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {endpoint.errorCodes.map((error, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{error.code}</TableCell>
                            <TableCell>{error.message}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
