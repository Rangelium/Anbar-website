import React, { Component } from "react";
import styled from "styled-components";
// import uuid from "react-uuid";
import dayjs from "dayjs";
import { GlobalDataContext } from "../../../components/GlobalDataProvider";
import api from "../../../tools/connect";

import { CustomButton } from "../../../components/UtilComponents";
import DecommForm from "./DecommisionForm/Form";
import UserSelection from "./UserSelection/Form";
import {
  IconButton,
  Paper,
  Collapse,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";

// Icons
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import RemoveIcon from "@material-ui/icons/Remove";
import DoneIcon from "@material-ui/icons/Done";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

class Row extends Component {
  static contextType = GlobalDataContext;
  state = {
    infoTable: false,
    productsTableData: [],
    loading: false,
  };

  finishSession() {
    api
      .executeProcedure(
        "[SalaryDB].anbar.[decommission_products_session_info_accept_insert]",
        {
          decommission_session_id: this.props.row.id,
        }
      )
      .then(() => {
        this.context.success("Sessiya təsdiq edildi");
        this.props.totalRefresh();
      })
      .catch((err) => this.context.error(err.errText));
  }
  handleExpandRowClick() {
    this.setState(
      (prevState) => {
        return {
          infoTable: !prevState.infoTable,
          loading: !prevState.infoTable,
        };
      },
      () => {
        if (this.state.infoTable) {
          this.getRowInfo();
        }
      }
    );
  }
  getRowInfo() {
    api
      .executeProcedure(
        "[SalaryDB].anbar.[decommission_session_info_selection]",
        {
          session_id: this.props.row.id,
        }
      )
      .then((res) => {
        this.setState({
          productsTableData: res,
          infoTable: Boolean(res.length > 0),
          loading: false,
        });
      })
      .catch((err) => console.error(err.errText));
  }

  render() {
    const data = this.props.row;

    return (
      <>
        <TableRow>
          <TableCell style={{ borderBottom: "unset" }}>
            <IconButton
              disabled={!Boolean(data.number_of_products)}
              size="small"
              onClick={this.handleExpandRowClick.bind(this)}
            >
              {this.state.infoTable ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell style={{ borderBottom: "unset" }} align="center">
            {dayjs(data.begin_date)
              .subtract(4, "hour")
              .format("YYYY-MM-DD, HH:mm")}
          </TableCell>
          <TableCell style={{ borderBottom: "unset" }} align="center">
            {data.number_of_products}
          </TableCell>
          <TableCell
            style={{ borderBottom: "unset" }}
            align="center"
          >{`${parseFloat(data.total_sum).toFixed(2)} ${
            data.default_currency
          }`}</TableCell>
          <TableCell style={{ borderBottom: "unset" }} align="center">
            {data.done === 3 ? <DoneIcon /> : <RemoveIcon />}
          </TableCell>
          <TableCell style={{ borderBottom: "unset" }} align="center">
            {data.done === 0 && (
              <CustomButton
                style={{ marginRight: "5px" }}
                onClick={() => this.props.showNewDecommForm(data.id)}
              >
                Əlavə et
              </CustomButton>
            )}
            {data.done === 1 && (
              <CustomButton
                onClick={() => {
                  this.context
                    .alert({
                      title: "Sessiyanı bitir",
                      description: "Əminsiniz?",
                    })
                    .then(() => this.finishSession())
                    .catch(() => {});
                }}
              >
                Təstiq et
              </CustomButton>
            )}
            {data.done === 0 && (
              <CustomButton
                disabled={!data.number_of_products}
                style={{ marginRight: "5px" }}
                onClick={() =>
                  this.props.showUserSelectionForm(data.id, data.number)
                }
              >
                Təstiqlənməyə göndər              
                </CustomButton>
            )}
            {data.done === -1 && <p style={{ color: "red" }}>DECLINED</p>}
            {(data.done === 0 || data.done === -1) && (
              <CustomButton
                style={{ height: "40px" }}
                onClick={() => {
                  this.context
                    .alert({
                      title: "Delete",
                      description: `Are you sure you want to delete?`,
                    })
                    .then(() => {
                      api
                        .executeProcedure(
                          "[SalaryDB].anbar.[decommission_session_delete]",
                          { id: data.id }
                        )
                        .then(() => {
                          this.getRowInfo();
                          this.props.totalRefresh();
                        })
                        .catch((err) => this.context.error(err.errText));
                    })
                    .catch(() => {});
                }}
              >
                <HighlightOffIcon />
              </CustomButton>
            )}
            {data.done === 2 && <p style={{color:"#FFB420"}}>Razılaşmadadır</p>}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={this.state.infoTable} timeout="auto" unmountOnExit>
              <Paper
                style={{ padding: "10px 0", position: "relative" }}
                elevation={0}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Məhsul</TableCell>
                      <TableCell align="center">Barkod</TableCell>
                      <TableCell align="center">Miqdar</TableCell>
                      <TableCell align="center">Qiymət</TableCell>
                      <TableCell align="center">Ümumi Qiymət</TableCell>
                      <TableCell align="center">Hücrə №</TableCell>
                      {data.done === "-" && (
                        <TableCell align="center">Sil</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.productsTableData.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell align="center">
                          {product.product_title}
                        </TableCell>
                        <TableCell align="center">
                          {product.barcode || <RemoveIcon />}
                        </TableCell>
                        <TableCell align="center">{`${product.quantity} ${product.unit_title}`}</TableCell>
                        <TableCell align="center">{`${product["price for 1"]} ${product.currency_title}`}</TableCell>
                        <TableCell align="center">{`${product.sum_price} ${product.currency_title}`}</TableCell>
                        <TableCell align="center">
                          {product.product_cell || <RemoveIcon />}
                        </TableCell>
                        {data.done === 0 && (
                          <TableCell align="center">
                            <IconButton
                              onClick={() => {
                                this.context
                                  .alert({
                                    title: "sessiyadan sil",
                                    description: `Əminsiniz ${product.product_title}?`,
                                  })
                                  .then(() => {
                                    api
                                      .executeProcedure(
                                        "[SalaryDB].anbar.[decommission_products_session_info_delete]",
                                        { id: product.id }
                                      )
                                      .then(() => {
                                        this.getRowInfo();
                                        this.props.refresh();
                                      })
                                      .catch((err) =>
                                        this.context.error(err.errText)
                                      );
                                  })
                                  .catch(() => {});
                              }}
                            >
                              <HighlightOffIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Backdrop
                  style={{
                    zIndex: 1000,
                    position: "absolute",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                  }}
                  open={this.state.loading}
                >
                  <CircularProgress style={{ color: "#fff" }} />
                </Backdrop>
              </Paper>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}

export default class WriteOffPage extends Component {
  state = {
    selectedSessionId: null,
    sessionIdForUserSelection: null,
    numberForUserSelection: null,
  };

  render() {
    return (
      <>
        <StyledTableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">Yaradılış tarixi</TableCell>
                <TableCell align="center">Miqdar</TableCell>
                <TableCell align="center">Ümumi qiymət</TableCell>
                <TableCell align="center">Təsdiq edilib</TableCell>
                <TableCell align="center">Fəaliyyət</TableCell>
                {/* <TableCell align="center">Sil</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.tableData.map((el) => (
                <Row
                  key={el.id}
                  row={el}
                  totalRefresh={this.props.totalRefresh}
                  showNewDecommForm={(id) =>
                    this.setState({ selectedSessionId: id })
                  }
                  showUserSelectionForm={(id, number) =>
                    this.setState({
                      sessionIdForUserSelection: id,
                      numberForUserSelection: number,
                    })
                  }
                />
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <DecommForm
          open={Boolean(this.state.selectedSessionId)}
          close={() => this.setState({ selectedSessionId: null })}
          refresh={this.props.refresh}
          sessionId={this.state.selectedSessionId}
        />

        {Boolean(this.state.sessionIdForUserSelection) &&
          Boolean(this.state.numberForUserSelection) && (
            <UserSelection
              open={true}
              close={() =>
                this.setState({
                  sessionIdForUserSelection: null,
                  numberForUserSelection: null,
                })
              }
              refresh={this.props.refresh}
              docId={this.state.sessionIdForUserSelection}
              number={this.state.numberForUserSelection}
            />
          )}
      </>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledTableContainer = styled(TableContainer)`
  overflow-y: auto;
  height: 100%;

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
`;
