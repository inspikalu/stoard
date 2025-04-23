import { NextResponse } from "next/server";
import ip3country from "ip3country";
import { getCountryName } from "@/lib/getCountryname";
export const runtime = 'edge';
// Initialize the module
ip3country.init();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ipAddr = searchParams.get("ip-addr");

    // Validate IP parameter
    if (!ipAddr) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Missing IP address parameter",
          example: "/api/geo-api?ip-addr=46.166.162.140",
        },
        { status: 400 }
      );
    }

    // Basic IP format validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddr)) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Invalid IP address format",
        },
        { status: 400 }
      );
    }

    // Perform the lookup
    const countryCode = ip3country.lookupStr(ipAddr);

    if (!countryCode) {
      return NextResponse.json(
        {
          status: "error",
          code: 404,
          message: "Country not found for this IP address",
        },
        { status: 404 }
      );
    }

    // Successful response
    return NextResponse.json({
      status: "success",
      code: 200,
      data: {
        ip: ipAddr,
        country: {
          code: countryCode,
          name: getCountryName(countryCode) || "Unknown",
        },
      },
    //   cached: false, // You could implement caching later
      execution_time: `${process.hrtime()[1] / 1000000}ms`, // Simple performance measurement
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}


