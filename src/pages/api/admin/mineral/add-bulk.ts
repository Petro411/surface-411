import { withRoleAuth } from "@/lib/middlewares/withRoleAuth";
import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";
import { US_STATES } from "@/config/dummy";


function safeTrim(value: any): string {
  return typeof value === "string" ? value.trim() : value != null ? String(value).trim() : "";
}

function normalizeKeys(row: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const key in row) {
    if (Object.hasOwn(row, key)) {
      normalized[key.trim()] = row[key];
    }
  }
  return normalized;
}

function mapToMineralOwnerSchema(row: any, fallback: { state?: any; counties?: string[] }) {
  const cleanRow = normalizeKeys(row);

  const stateCode = safeTrim(cleanRow["State"]).toUpperCase();
  const stateName = US_STATES[stateCode] || "";

  const rowState = stateCode
    ? { name: stateName, code: stateCode }
    : null;

  const ownerStateCode = safeTrim(cleanRow["addr_state"]).toUpperCase();
  const ownerState = ownerStateCode ? { name: US_STATES[ownerStateCode], code: ownerStateCode } : null;

  const rowCounties = [
    safeTrim(cleanRow["County"])
  ].filter(Boolean);

  return {
    names: [
      safeTrim(cleanRow["Name"]),
      safeTrim(cleanRow["Name Line 2"]),
      safeTrim(cleanRow["Name Line 3"]),
    ].filter(Boolean),

    emails: [
      safeTrim(cleanRow["email_line 1"]),
      safeTrim(cleanRow["email_line 2"]),
      safeTrim(cleanRow["email_line 3"]),
    ].filter(Boolean),

    numbers: [
      safeTrim(cleanRow["phone_line 1"]),
      safeTrim(cleanRow["phone_line 2"]),
      safeTrim(cleanRow["phone_line 3"]),
    ].filter(Boolean),

    addresses: [
      safeTrim(cleanRow["addr_line1"]),
      safeTrim(cleanRow["addr_line2"]),
      safeTrim(cleanRow["addr_line3"]),
    ].filter(Boolean),

    counties: rowCounties.length > 0 ? rowCounties : (fallback.counties ?? []),

    zipcode: safeTrim(cleanRow["addr_zip"]),
    description: safeTrim(cleanRow["legal_description"]),
    city: safeTrim(cleanRow["addr_city"]),

    state: rowState || fallback.state || { name: "", code: "" },
    ownerState: ownerState || fallback.state || { name: "", code: "" }
  };
}




const handler = async (req: any, res: any) => {
  try {

    if (!Array.isArray(req.body?.list) || req.body?.list.length === 0) {
      return res.status(400).json({
        message: "No data provided",
        success: false
      });
    }

    const fallback = {
      state: req.body.state,
      counties: req.body.counties,
    };

    const transformedData = req.body.list.map((row: any) =>
      mapToMineralOwnerSchema(row, fallback)
    );
    const savedRecords = await MineralOwner.insertMany(transformedData, { ordered: false });

    return res.status(200).json({
      data: savedRecords,
      success: true
    });
  } catch (error: any) {
    return res.status(error?.statusCode ?? 500).json({
      message: error?.message,
      success: false,
      status: error?.statusCode ?? 500
    })
  }
};


export default withCors(withAuth(withRoleAuth(withMethod(handler, ['POST']), ['admin'])));
