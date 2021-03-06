import React, { Component } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { Typography, Paper } from "@material-ui/core";

// Icons
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

export default class OverallInfo extends Component {
  render() {
    if (!this.props.overallInfo) return <OverallData />;

    return (
      <OverallData>
        <div className="block">
          <div className="row">
            <InfoOutlinedIcon style={{ width: "25px", height: "25px" }} />
            <Typography variant="h1">Ümumi məlumat</Typography>
          </div>
        </div>
        <div className="block">
          <div className="row">
            <Typography variant="h2">Statistika</Typography>
          </div>

          <div className="row special">
            <StyledPaper elevation={3}>
              <p className="title">Məhsulların ümumi miqdarı</p>
              <p>
                {this.props.overallInfo.quantity ? this.props.overallInfo.quantity : 0}
              </p>
            </StyledPaper>
            <StyledPaper elevation={3}>
              <p className="title">Unikal məhsulların sayı</p>
              <p>
                {this.props.overallInfo.remaining_products
                  ? this.props.overallInfo.remaining_products
                  : 0}
              </p>
            </StyledPaper>
            <StyledPaper elevation={3}>
              <p className="title">Anbarın ümumi dəyəri</p>
              <p>
                {this.props.overallInfo.cost
                  ? `${parseFloat(this.props.overallInfo.cost).toFixed(2)} ${
                      this.props.overallInfo.last_in_currency
                    }`
                  : 0}
              </p>
            </StyledPaper>
          </div>
        </div>
        <div className="block">
          <div className="row">
            <Typography variant="h2">Son dəyişiklər</Typography>
          </div>
          <div className="row special2">
            <StyledPaper elevation={3}>
              <div className="specialBlock">
                <p className="specialUtil specialRow">
                  <InfoOutlinedIcon className="specialIcon" /> Son sifariş (mədaxil)
                </p>
                <h2
                  className="specialTitle specialRow"
                  title={
                    this.props.overallInfo.last_in_name
                      ? this.props.overallInfo.last_in_name.length > 24
                        ? this.props.overallInfo.last_in_name
                        : undefined
                      : undefined
                  }
                >
                  {this.props.overallInfo.last_in_name
                    ? this.props.overallInfo.last_in_name.length > 24
                      ? this.props.overallInfo.last_in_name.slice(0, 24) + "..."
                      : this.props.overallInfo.last_in_name
                    : "None"}
                </h2>
                <div className="data specialRow">
                  <p className="dataEl">
                    Barkod:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_in_id
                        ? this.props.overallInfo.last_in_id
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Tarix:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_in_date
                        ? dayjs(this.props.overallInfo.last_in_date)
                            .subtract(4, "hour")
                            .format("YYYY-MM-DD, HH:mm")
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Qiymət:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_in_price
                        ? `${this.props.overallInfo.last_in_price} ${this.props.overallInfo.last_in_currency}`
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Miqdar:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_in_quantity
                        ? `${this.props.overallInfo.last_in_quantity} ${this.props.overallInfo.last_in_unit_title}`
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Ümumi qiymət:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_in_price_total
                        ? `${this.props.overallInfo.last_in_price_total} ${this.props.overallInfo.last_in_currency}`
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Faktura №:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_in_invoice_num
                        ? this.props.overallInfo.last_in_invoice_num
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                  Electron qaimə №:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_in_act_num
                        ? this.props.overallInfo.last_in_act_num
                        : 0}
                    </span>
                  </p>
                </div>
              </div>
            </StyledPaper>

            <StyledPaper elevation={3}>
              <div className="specialBlock">
                <p className="specialUtil specialRow">
                  <InfoOutlinedIcon className="specialIcon" /> Son sifariş (məxaric)
                </p>
                <h2 className="specialTitle specialRow">
                  {this.props.overallInfo.last_out_name
                    ? this.props.overallInfo.last_out_name
                    : "None"}
                </h2>
                <div className="data specialRow">
                  <p className="dataEl">
                    Barkod:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_out_id
                        ? this.props.overallInfo.last_out_id
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Tarix:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_out_date
                        ? dayjs(this.props.overallInfo.last_out_date)
                            .subtract(4, "hour")
                            .format("YYYY-MM-DD, HH:mm")
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Qiymət:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_out_price
                        ? `${this.props.overallInfo.last_out_price} ${this.props.overallInfo.last_out_currency}`
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Miqdar:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_out_quantity
                        ? `${this.props.overallInfo.last_out_quantity} ${this.props.overallInfo.last_out_unit_title}`
                        : 0}
                    </span>
                  </p>
                  <p className="dataEl">
                    Ümumi qiymət:
                    <span className="dataElVal">
                      {this.props.overallInfo.last_out_price
                        ? `${this.props.overallInfo.last_out_price_total} ${this.props.overallInfo.last_out_currency}`
                        : 0}
                    </span>
                  </p>
                </div>
              </div>
            </StyledPaper>
          </div>
        </div>
      </OverallData>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const OverallData = styled.section`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  svg {
    color: #faa61a;
  }

  .block {
    width: 100%;
    display: inherit;
    flex-direction: column;

    .row {
      width: 100%;
      margin: 10px 0;
      display: inherit;
      align-items: center;
    }

    .special {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: 15px;
    }
    .special2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 15px;
    }
  }

  h1 {
    font-size: 1.9rem;
    font-weight: 500;
    color: #231f20;
    padding-left: 10px;
  }
  h2 {
    font-size: 1.6rem;
    font-weight: 500;
    color: #231f20;
  }
`;
const StyledPaper = styled(Paper)`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border-radius: 10px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border-radius: 10px;
    background: #d7d8d6;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 1300px) {
    margin-right: 0;
    margin-bottom: 5px;
  }

  p {
    font-size: 1.6rem;
    font-weight: 500;
    color: #231f20;
  }

  .title {
    width: 200px;
    font-size: 1rem;
    font-weight: 400;
    color: #474c54;
    padding-bottom: 5px;
  }

  .specialBlock {
    width: 100%;
    height: 260px;
    display: flex;
    flex-direction: column;

    .specialRow {
      padding-left: 35px;
      margin-top: 20px;
    }

    .specialUtil {
      position: relative;
      margin-top: 0;
      color: #5f6369;
      font-weight: 400;
      font-size: 1rem;

      .specialIcon {
        transform: scale(1.2);
        position: absolute;
        left: -10px;
        top: -3px;
      }
    }

    .specialTitle {
    }

    .data {
      .dataEl {
        margin-top: 3px;
        color: #5f6369;
        font-weight: 400;
        font-size: 1.2rem;

        .dataElVal {
          padding-left: 10px;
          font-size: 1.2rem;
          font-weight: 500;
          color: #231f20;
        }
      }
    }
  }
`;
