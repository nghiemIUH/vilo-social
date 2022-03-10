import React, { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AuthContext from "./authContext";

const theme = createTheme();
function Signup() {
    const { signupUser } = useContext(AuthContext);
    const [avatar, setAvatar] = useState("");
    const changeAvatar = () => {
        let reader = new FileReader();
        reader.onloadend = (e1) => {
            setAvatar(e1.target.result);
        };
        reader.readAsDataURL(document.querySelector("#avatar").files[0]);
    };
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {avatar.length === 0 ? (
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <HowToRegIcon />
                        </Avatar>
                    ) : (
                        <Avatar
                            src={avatar}
                            sx={{ m: 1, bgcolor: "lightgray" }}
                        ></Avatar>
                    )}

                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={(e) =>
                            signupUser(e, document.querySelector("#avatar"))
                        }
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm_password"
                            label="Confirm Password"
                            type="password"
                            id="confirm_password"
                            autoComplete="current-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                            autoComplete="current-email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="first_name"
                            label="First Name"
                            type="text"
                            id="first_name"
                            autoComplete="current-fn"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="last_name"
                            label="Last Name"
                            type="text"
                            id="last_name"
                            autoComplete="current-ln"
                        />
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mt: 2 }}
                        >
                            Upload avatar*
                            <input
                                type="file"
                                hidden
                                onChange={changeAvatar}
                                id="avatar"
                            />
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Have an account? Lg in"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Signup;
