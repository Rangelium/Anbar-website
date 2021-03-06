import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// import uuid from "react-uuid";
import styled from "styled-components";
import api from "../tools/connect";
import { GlobalDataContext } from "./GlobalDataProvider";

import { CustomButton } from "./UtilComponents";
import {
  Divider,
  Typography,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { ReactComponent as ExpressLogo } from "../assets/expressLogo.svg";

export default class Navbar extends Component {
  static contextType = GlobalDataContext;
  state = {
    storageData: [],

    loading: true,
  };

  componentDidMount() {
    this.getStoragesList();
  }
  getStoragesList = () => {
    api
      .executeProcedure("anbar.storage_select_all",{
        user_structure_id: this.context.userStructureId,
      })
      .then((data) => {
        this.context.setStorage(data[0].id, data[0].storage_name);
        // console.log(data)
        this.setState({
          storageData: data,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);

        if (err.error.response.data.error === "unauthorized") {
          this.context.setToken(null);
        }
      });
  };
  handleChange(event) {
    const selectedTitle = this.state.storageData.find(
      (storage) => storage.id === event.target.value
    ).storage_name;

    this.context.setStorage(event.target.value, selectedTitle);
  }

  render() {
    return (
      <StyledAppbar position="relative">
        <Logo />
        <Divider orientation="vertical" />
        {!this.state.loading && this.state.storageData.length === 1 && (
          <Typography className="AnbarName">{this.state.storageData[0].storage_name}</Typography>
           )}
        {!this.state.loading && this.state.storageData.length > 1 && (
          <Select
            disableUnderline
            value={this.context.storageId}
            onChange={(e) => this.handleChange(e)}
            IconComponent={ExpandMoreIcon}
            MenuProps={{
              style: { zIndex: 10000000 },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "center",
              },
              getContentAnchorEl: null,
            }}
          >
            {this.state.storageData.map((storage) => (
              <MenuItem key={storage.id} value={storage.id}>
                {storage.storage_name}
              </MenuItem>
            ))}
          </Select>
        )}
        <div className="links">
          {this.props.routes.map(({ name, path, children }, i) => {
            if (children) {
              return (
                <div key={`${name}_${i}`} className="link navGroup">
                  <Typography className="group">{name}</Typography>
                  <ExpandMoreIcon className="groupIcon" />
                  <List>
                    {children.map(({ name, path, hidden }, i) => (
                      <ListItem button key={`${path}_${i}`}>
                        <NavLink
                          className="link"
                          title={name}
                          activeClassName="selectedLink"
                          exact
                          to={path}
                        >
                          <ListItemText>{name}</ListItemText>
                        </NavLink>
                      </ListItem>
                    ))}
                  </List>
                </div>
              );
            }
            return (
              <NavLink
                className="link"
                key={`${path}_${i}`}
                title={name}
                activeClassName="selectedLink"
                exact
                to={path}
              >
                <Typography>{name}</Typography>
              </NavLink>
            );
          })}
        </div>

        <CustomButton
          style={{ marginRight: 15 }}
          onClick={() => {
            this.context
              .alert({ title: "Çıxış", description: "Əminsiniz?" })
              .then(() => {
                this.context.setToken(null);
                window.location.replace("http://192.168.0.182:54321/?from=warehouse&action=logout")
              })
              .catch(() => {});
          }}
        >
          Çıxış
          {/* {console.log(this.context.userStructureId,this.context.storageId)} */}
        </CustomButton>
      </StyledAppbar>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledAppbar = styled.nav`
  background-color: #ffffff;
  box-shadow: none;
  border-bottom: 2px solid rgb(35, 31, 32, 0.1);
  height: 56px;
  align-items: center;
  display: flex;

  .AnbarName{
    font-weight: bold;
  }

  hr {
    height: 2rem;
    margin-right: 12px;
  }

  .MuiSelect-root {
    color: #231f20;
    font-weight: 600;
  }

  .links {
    /* margin-right: 40px; */
    margin-left: auto;
    flex-grow: 0.6;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .link {
      cursor: pointer;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .MuiTypography-root {
        font-size: 1rem;
        color: #231f20;
      }

      &:hover::after {
        @keyframes showUnderline {
          from {
            opacity: 0;
            left: -30%;
          }
          to {
            opacity: 1;
            left: 0;
          }
        }

        animation: showUnderline 0.3s 1 forwards;
      }

      &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: -2px;
        width: 100%;
        border-bottom: 2px solid #faa61a;
        opacity: 0;
        transition: 0.3s;
      }
    }

    .navGroup {
      .groupIcon {
        transform: rotate(0deg);
        transition: 0.3s;
      }
      &::after {
        display: none;
      }
      &:hover {
        .groupIcon {
          transform: rotate(180deg);
        }

        .MuiList-root {
          /* z-index: 100000000000000000; */
          opacity: 1;
          top: 100%;
          pointer-events: all;
        }
      }

      .MuiList-root {
        /* z-index: 1; */
        z-index: 100000000000000000;
        pointer-events: none;
        transition: 0.3s;
        opacity: 0;
        position: absolute;
        top: 70%;
        min-width: 120%;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
          0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);

        .link {
          width: 100%;
          text-align: center;

          .MuiTypography-root {
            white-space: nowrap;
          }
        }
      }
    }

    .selectedLink {
      &::after {
        opacity: 1;
      }
      &:hover::after {
        animation: none;
      }
    }
  }
`;
const Logo = styled(ExpressLogo)`
  height: 2rem;
`;
