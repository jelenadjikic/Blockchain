import * as React from 'react';
import { useNavigate, NavLink } from 'react-router-dom'
import { AppBar, Box, Toolbar, Container, Button, IconButton} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function Header() {

  const navigate = useNavigate()

  
  return (
    <div>
        <AppBar position="static" >
            <Container maxWidth="xl">
                <Toolbar  >
                <Box sx={{ flexGrow: 1, display: { xs: 'column', md: 'flex' } }}>
                  
                    <NavLink
                        style={{marginRight: "20px",  marginBottom: "24px", marginTop: "24px", color: 'white', display: 'block', textDecoration:"none" }}
                        to = "/addNewPurchase"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >  
                        Add new item
                    </NavLink>  

                    <NavLink
                        style={{ marginRight: "20px", marginBottom: "24px", marginTop: "24px", color: 'white', display: 'block', textDecoration:"none" }}
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                        to ="/activeSales"
                    >  
                        Active sales
                    </NavLink>  

                    <NavLink
                        style={{  marginRight: "20px", marginBottom: "24px", marginTop: "24px", color: 'white', display: 'block', textDecoration:"none" }}
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                        to ="/mySales"
                    >  
                        My sales
                    </NavLink> 

                    <NavLink
                        style={{  marginRight: "20px", marginBottom: "24px", marginTop: "24px", color: 'white', display: 'block', textDecoration:"none" }}
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                        to = "/myPurchases"
                    >  
                        My purchases
                    </NavLink> 
                    
                    
                    <NavLink
                        style={{  marginRight: "20px", marginBottom: "24px", marginTop: "24px", color: 'white', display: 'block', textDecoration:"none" }}
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                        to ="/soldItems"
                    >  
                        Sold items
                    </NavLink> 

                    <NavLink
                        style={{ marginBottom: "24px", marginTop: "24px", color: 'white', display: 'block', textDecoration:"none" }}
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                        to = "/sellers"
                    >  
                        Sellers
                    </NavLink>  
                </Box>
                <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>  
                    <HomeIcon onClick = {() => {navigate("/")}} /> 
                </IconButton>
                </Toolbar>
            </Container>
            </AppBar>
    </div>
  )
}

export default Header
