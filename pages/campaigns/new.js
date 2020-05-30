import React, { useState } from "react";
import { Form, Button, Input, Dropdown, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Link, Router } from "../../routes";

export default function CampaignNew() {
  const [miniContribution, setMiniContribution] = useState("");
  const [coin, setCoin] = useState("wei");
  const [errorMEssage, setErrorMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const options = [
    { key: "wei", text: "wei", value: "wei" },
    { key: "Gwei", text: "Gwei", value: "Gwei" },
    { key: "ether", text: "ether", value: "ether" },
  ];

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      setErrorMessage("");

      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(web3.utils.toWei(miniContribution, coin))
        .send({
          from: accounts[0],
        });

      setCreating(false);

      Router.pushRoute("/");
    } catch (err) {
      setCreating(false);
      setErrorMessage(err.message);
    }
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMEssage}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label={
              <Dropdown
                options={options}
                value={coin}
                onChange={(e, { value }) => setCoin(value)}
              />
            }
            labelPosition="right"
            value={miniContribution}
            onChange={(e) => setMiniContribution(e.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMEssage} />
        <Button loading={creating} primary>
          Create !
        </Button>
        <Link route="/">
          <a>
            <Button content="Cancel" icon="cancel" secondary />
          </a>
        </Link>
      </Form>
    </Layout>
  );
}
