import React, { useEffect, useState } from 'react';
import { useQuery, gql } from "@apollo/client";

// material UI Components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

const ProductsQuery = gql`
    query Product($currency:Currency){
        products{
            id
            title
            image_url
            price(currency: $currency)
        }
    }
    
`;
const CurrencyListQuery = gql`
{
    currency
  }
    
`;
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  }));


const styles = 
{
    media: {
        height: 140,
        paddingTop: '15.25%', // 16:9,
        marginTop:'10',
        objectFit: 'contain'
    },
    button: {
        backgroundColor: '#4b5548'
    }
};
const drawerWidth = 500;

const Products = () => {
    
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [currency, setCurrency] = useState('USD')
    const ProductsData = useQuery(ProductsQuery,{ variables: {currency}});
    const CurrencyData= useQuery(CurrencyListQuery);
    const error = ProductsData.error || CurrencyData.error;
    const loading = ProductsData.loading || CurrencyData.loading;
    

    useEffect(() => {
        document.title = 'All Products|Lumin Skincare';
        total();
    }, [cart]);

    const total = () => {
        let totalVal = 0;
        for (let i = 0; i < cart.length; i++) {
          totalVal += cart[i].price;
        }
        setCartTotal(totalVal);
      };

    const addToCart = (e) => {
        
        setCart([...cart, e]);
            console.log('The product has been added to cart:', cart);
        setOpen(true);

        // const check_item = cart.findIndex(item => item.id === e.id);
        // console.log(check_item.id);
        // if (check_item !== -1) {
        //     cart.quantity = 0
        //    cart[check_index].quantity++;
        //     console.log("Quantity updated:");
        // } 
        // else {
        //     setCart([...cart, e]);
        //     console.log('The product has been added to cart:', cart);
        // }

    };
  
    const removeFromCart = (e) => {
      let hardCopy = [...cart];
      hardCopy = hardCopy.filter((cartItem) => cartItem.id !== e.id);
      setCart(hardCopy);
    };

    const handleChange = (event) => {
        setCurrency(event.target.value);
    };

    if (loading) {
        return <div>{loading}</div>;
    }

    if (error) {
    return <div>{error}</div>;
    }
    
    const handleClose = () => {
    setOpen(false);
    };

    return (
        <div className="App">
            <Box sx={{ width: '100%',  backgroundColor: '#e0e2e0' }} justifyContent="center"  alignItems="center" >
                
                <AppBar position="fixed" sx={{backgroundColor: '#e0e2e0'}}>
                    <Toolbar>
                        <Typography variant="h6" color="#000" align='left' component="div" sx={{ flexGrow: 1 }}>
                            L  U  M  I  N
                        </Typography>
                        <Button color="inherit">Shop</Button>
                        <Button color="inherit">Learn</Button>
                        <Button color="inherit">Account</Button>
                        <Button color="inherit" onClick={() => setOpen(true)}>Cart({cart.length})</Button>
                    </Toolbar>
                </AppBar>
                <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                <Grid xs={2} item></Grid>
                <Grid xs={8} item >
                <Grid container rowSpacing={4} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
                {ProductsData.data.products.map((product) => (
                <Grid item xs={4} key={product.id}>
                    <Card >
                    <CardMedia
                        component="img"
                        image={product.image_url}
                        alt={product.title}
                        style={styles.media}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="body2" component="div">
                            {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            From {currency} {product.price}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' style={styles.button} onClick={() => addToCart(product)}>Add to Cart</Button>
                    </CardActions>
                </Card>
                </Grid>
                 ))}
            </Grid>
            </Grid>
            <Grid xs={2} item></Grid>
                    {/* Cart Items */}
             
            <Box>
            <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        backgroundColor: '#f5f5f4',
                        overflow: 'auto'
                        },
                    }}
                    anchor='right'
                    open = {open}
                    onClose={handleClose}
                >
                <Grid container spacing={2}>
                    <DrawerHeader>
                        <Typography variant="subtitle1">My Shopping Cart </Typography>
                        
                        <IconButton onClick={handleClose}>
                            <ChevronRightIcon />
                        </IconButton>
                    
                        <Select
                            value={currency}
                            onChange={handleChange}
                            >
                                {CurrencyData.data.currency.map(cl =>(
                                    <MenuItem key={cl} value={cl}>{cl}</MenuItem>
                                ))}
                        </Select>
                    </DrawerHeader>
                </Grid>
                    {cart.map((item) => (
                    <Card sx={{ maxWidth: 345 }}>
                        <IconButton edge='end' onClick={() => removeFromCart(item)}>
                            <CloseIcon />
                        </IconButton>
                        <CardMedia
                            component="img"
                            image={item.image_url}
                            alt={item.title}
                            style={styles.media}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="body2" component="div">
                                {item.title}
                            </Typography>
                            
                        </CardContent>
                        <CardActions>
                            <ButtonGroup variant="outlined"  aria-label="outlined button group">
                                <Button>+</Button>
                                <Button>1</Button>
                                <Button>-</Button>
                            </ButtonGroup>
                            <Typography variant="body2" color="text.secondary">
                            &nbsp;&nbsp;&nbsp;{currency} {item.price}
                            </Typography>
                        </CardActions>
                    </Card>
                    ))}
                     <Divider />
                     <div>SUBTOTAL: {currency} {cartTotal}</div>
                    <Button variant='contained' style={styles.button} onClick={handleClose}>PROCEED TO CHECKOUT</Button>
                </Drawer></Box>
            </Grid>
            </Box>
        </div>
    );
};
export default Products;