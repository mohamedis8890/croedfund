import React, { useState } from "react";
import { Form, Button, Input, Dropdown, Message } from "semantic-ui-react";

import web3 from "../ethereum/web3";
import { Router } from "../routes";
import Campaign from "../ethereum/campaign";
import EtherInput from "./EtherInput";

export default function ContributeForm({ address }) {
  const [contribution, setContribution] = useState("");
  const [coin, setCoin] = useState("ether");
  const [errorMEssage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, coin),
      });
      setLoading(false);
      setContribution("");
      Router.replaceRoute(`/campaigns/${address}`);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit} error={!!errorMEssage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <EtherInput
            onChangeAmount={setContribution}
            onSetCoin={setCoin}
            coin={coin}
            amount={contribution}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMEssage} />
        <Button loading={loading} primary>
          Contribute !
        </Button>
      </Form>
    </div>
  );
}
