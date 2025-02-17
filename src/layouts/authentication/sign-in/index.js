/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useRef, useEffect } from "react";

import axios from 'axios';

// react-router-dom components
import { Link, json } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { useSignIn } from 'react-auth-kit'
import { useJwt } from "react-jwt";      
import { isExpired, decodeToken } from "react-jwt";



function Basic() {
  const [rememberMe, setRememberMe] = useState(false);

  const userRef = useRef();
  const passwordRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const signIn = useSignIn()

  const onClickSignIn = () => {

    const data = {
      'username': user,
      'password': password,
    };

    axios.post('http://localhost:3000/pub/signin', data, { headers: {
        'Content-Type': 'application/json'
    }})
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const resp_data = JSON.parse(response.data)
      /* TODO: AuthProvider refresh token */
      // "refreshToken": resp_data.refresh_token,
      // "refreshTokenExpireIn": resp_data.refresh_expires_in,

      // const { decodedToken, isExpired } = decodeToken(resp_data.access_token);
      const decodedToken = decodeToken(resp_data.access_token);
      console.log(decodedToken);

      if (signIn({
        "token": resp_data.access_token,
        "expiresIn": resp_data.expires_in,
        "tokenType": 'Bearer',
        "authState": {email: user, family_name: decodedToken.family_name, given_name: decodedToken.given_name, name: decodedToken.name},
      })) {
          console.log('redirect' + window.location.search + window.location.hash)

          const params = new URLSearchParams(window.location.search)
          if (params.get('r')) {
            console.log(params.get('r'))
            window.location.href = params.get('r') + "" + window.location.hash
          } else {
            window.location.href = window.location.hostname
          }
      }
    })
    .catch((error) => {
      console.log(error);
    });    

    // const kcAuthState = {
    //   email: 'joeshmoe@mailismagic.com'
    // }
    // if (signIn({
    //     token: 'abc',
    //     expiresIn: 1,
    //     tokenType: 'Bearer',
    //     authState: kcAuthState
    //   })) {

    //   console.log('redirect' + window.location.search + window.location.hash)
      
      // const params = new URLSearchParams(window.location.search)
      // if (params.get('r')) {
      //   console.log(params.get('r'))
      //   window.location.href = params.get('r') + "" + window.location.hash
      // } else {
      //   // window.location.href = window.location.hostname
      // }
      
    //   } else {
    //     console.log('error')
    //   }
  }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput ref={userRef} type="email" label="Email" required fullWidth 
                onChange={(e) => setUser(e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput ref={passwordRef} type="password" label="Password" required fullWidth 
                onChange={(e) => setPassword(e.target.value)} />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={onClickSignIn}>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
