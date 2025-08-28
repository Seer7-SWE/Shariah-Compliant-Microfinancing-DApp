import contracts from "../contracts.json";

export function getContractData(name) {
  const data = contracts[name];
  if (!data) throw new Error("Contract not found: " + name);
  return data;
}
