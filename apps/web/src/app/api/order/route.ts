import fs from "fs";
import path from "path";
import { createJsonTranslator, createLanguageModel } from "typechat";
import { NextRequest, NextResponse } from "next/server";
import type { Cart } from "../../coffeeShopSchema";

export async function POST(request: NextRequest): Promise<NextResponse<Cart>> {
  try {
    const model = createLanguageModel(process.env);
    const schema = fs.readFileSync(
      path.join(__dirname, "../../../../../src/app/coffeeShopSchema.ts"),
      "utf8"
    );
    const translator = createJsonTranslator<Cart>(model, schema, "Cart");
    const textBody = await request.text();

    const response = await translator.translate(textBody);
    if (!response.success) {
      return new NextResponse<Cart>(response.message, {
        status: 500,
      });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return new NextResponse<Cart>(error, {
      status: 500,
    });
  }
}
