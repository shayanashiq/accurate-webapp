import { NextResponse } from 'next/server';
import { accurateFetch } from '@/lib/accurate';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log(
      '👥 Creating customer with payload:',
      JSON.stringify(body, null, 2)
    );

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'name is required' },
        { status: 400 }
      );
    }

    if (!body.transDate) {
      return NextResponse.json(
        { success: false, error: 'transDate is required' },
        { status: 400 }
      );
    }

    // Build form data - only include fields that are provided
    const formParams: Record<string, string> = {
      name: body.name,
      transDate: body.transDate,
    };

    // Optional fields
    if (body.customerNo) formParams.customerNo = body.customerNo;
    if (body.mobilePhone) formParams.mobilePhone = body.mobilePhone;
    if (body.email) formParams.email = body.email;
    if (body.billStreet) formParams.billStreet = body.billStreet;
    if (body.billCity) formParams.billCity = body.billCity;
    if (body.billProvince) formParams.billProvince = body.billProvince;
    if (body.billCountry) formParams.billCountry = body.billCountry;
    if (body.billZipCode) formParams.billZipCode = body.billZipCode;

    console.log('📤 Sending to Accurate API:', formParams);

    // Create customer using save.do endpoint
    const response = await accurateFetch('/accurate/api/customer/save.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formParams).toString(),
    });

    console.log('📥 Accurate API response:', JSON.stringify(response, null, 2));

    // Check if request was successful
    if (!response.s) {
      console.error('❌ Customer creation failed:', response.d);
      return NextResponse.json(
        {
          success: false,
          error: response.d || 'Failed to create customer',
        },
        { status: 400 }
      );
    }

    // Extract customer data from response
    const customerData = response.r || {};

    console.log('✅ Customer created successfully!');
    console.log('   ID:', customerData.id);
    console.log('   Customer No:', customerData.customerNo);

    // Return minimal e-commerce data
    return NextResponse.json({
      success: true,
      message: response.d || 'Customer created successfully',
      customer: {
        id: customerData.id || null,
        customerNo: customerData.customerNo || null,
        name: customerData.name || null,
        email: customerData.email || null,
        mobilePhone: customerData.mobilePhone || null,
        billStreet: customerData.billStreet || null,
        billCity: customerData.billCity || null,
        billProvince: customerData.billProvince || null,
        billCountry: customerData.billCountry || null,
        billZipCode: customerData.billZipCode || null,
        shipStreet: customerData.shipStreet || null,
        shipCity: customerData.shipCity || null,
        shipProvince: customerData.shipProvince || null,
        shipCountry: customerData.shipCountry || null,
        shipZipCode: customerData.shipZipCode || null,
        shipSameAsBill: customerData.shipSameAsBill || false,
        priceCategoryId: customerData.priceCategoryId || null,
        termId: customerData.term?.id || null,
        balance: customerData.balanceList?.[0]?.balance || 0,
      },
    });
  } catch (err: any) {
    console.error('❌ Error creating customer:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
