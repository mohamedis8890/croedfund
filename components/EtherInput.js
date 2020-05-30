import React from "react";
import { Input, Dropdown } from "semantic-ui-react";

export default function EtherInput({
  onSetCoin,
  onChangeAmount,
  coin,
  amount,
}) {
  const options = [
    { key: "wei", text: "wei", value: "wei" },
    { key: "Gwei", text: "Gwei", value: "Gwei" },
    { key: "ether", text: "ether", value: "ether" },
  ];
  return (
    <Input
      label={
        <Dropdown
          options={options}
          value={coin}
          onChange={(e, { value }) => onSetCoin(value)}
        />
      }
      labelPosition="right"
      value={amount}
      onChange={(e) => onChangeAmount(e.target.value)}
    />
  );
}
