type Item = {
  _id: string;
  names: string[];
  emails: string[];
  numbers: string[];
  addresses: string[];
  counties: string[];
  zipcode: string;
  description: string;
  city?:string;
  state: {
    name: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const downloadMineralList = (data: Item[], filename = "data.csv") => {
  // Match the format the admin originally uploaded
  const headers = [
    "Name",
    "Email",       // single email per cell (or comma-separated if multiple)
    "Number",      // single number per cell (or comma-separated)
    "Address",     // same as uploaded
    "County",
    "Zip",
    "Description",
    "State",       // State Name
    "State Code"
  ];

  const rows = data.map(item => [
    Array.isArray(item.names) ? item.names.join(", ") : (item.names ?? ""),
    Array.isArray(item.emails) ? item.emails.join(", ") : (item.emails ?? ""),
    Array.isArray(item.numbers) ? item.numbers.join(", ") : (item.numbers ?? ""),
    Array.isArray(item.addresses) ? item.addresses.join(", ") : (item.addresses ?? ""),
    Array.isArray(item.counties) ? item.counties.join(", ") : (item.counties ?? ""),
    item.zipcode ?? "",
    item.description ?? "",
    item.state?.name ?? "",
    item.state?.code ?? ""
  ]);

  const csvContent =
    [headers, ...rows]
      .map(row =>
        row.map(field =>
          `"${String(field).replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formateListToCSV = (data: Item[]) => {
  // Match the format the admin originally uploaded
  const headers = [
    "Name",
    "Email",       // single email per cell (or comma-separated if multiple)
    "Number",      // single number per cell (or comma-separated)
    "Address",     // same as uploaded
    "County",
    "Zip",
    "Description",
    "City",
    "State",       // State Name
    "State Code"
  ];

  const rows = data.map(item => [
    Array.isArray(item.names) ? item.names.join(", ") : (item.names ?? ""),
    Array.isArray(item.emails) ? item.emails.join(", ") : (item.emails ?? ""),
    Array.isArray(item.numbers) ? item.numbers.join(", ") : (item.numbers ?? ""),
    Array.isArray(item.addresses) ? item.addresses.join(", ") : (item.addresses ?? ""),
    Array.isArray(item.counties) ? item.counties.join(", ") : (item.counties ?? ""),
    item.zipcode ?? "",
    item.description ?? "",
    item.city ?? "",
    item.state?.name ?? "",
    item.state?.code ?? ""
  ]);

  const csvContent =
    [headers, ...rows]
      .map(row =>
        row.map(field =>
          `"${String(field).replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

  return csvContent
};
