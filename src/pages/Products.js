import React, { useEffect, useState } from 'react';
import { useQuery, gql } from "@apollo/client";

// material UI Components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Products = () => {
    
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [currency, setCurrency] = useState('USD')
    const ProductsData = useQuery(ProductsQuery,{ variables: {currency}});
    // const ProductsData = useQuery(ProductsQuery);
    const CurrencyData= useQuery(CurrencyListQuery);
    const error = ProductsData.error || CurrencyData.error;
    const loading = ProductsData.loading || CurrencyData.loading;

    useEffect(() => {
        document.title = 'All Products|Lumin Skincare';

        total();
        // console.log(currencylist)
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

        // const check_index = cart.find(item => item.id === e.id);
        // console.log(check_index.id);
        // if (check_index !== -1) {
        //     // cart[check_index].quantity++;
        //     console.log("Quantity updated:", cart);
        // } else {
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
        return <div>loading</div>;
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
            <Grid sx={{ flexGrow: 1 }} container spacing={2}>
            <AppBar position="static" sx={{backgroundColor: '#e0e2e0'}}>
                    <Toolbar>
                        <Typography variant="h6" color="#000000" component="div" sx={{ flexGrow: 1 }}>
                            L  U  M  I  N
                        </Typography>
                        <Button color="inherit">Shop</Button>
                        <Button color="inherit">Learn</Button>
                        <Button color="inherit">Account</Button>
                        <Button color="inherit">Cart({cart.length})</Button>
                    </Toolbar>
                </AppBar>
                <Grid xs={2} item></Grid>
                <Grid xs={8} item >
                <Grid container justifyContent="center" rowSpacing={4} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
                {ProductsData.data.products.map((product) => (
                <Grid item xs={4} item key={product.id}>
                    <Card >
                    <CardMedia
                        component="img"
                        height="140"
                        image={product.image_url}
                        alt={product.title}
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
                        <Button variant='contained' onClick={() => addToCart(product)}>Add to Cart</Button>
                    </CardActions>
                </Card>
                </Grid>
                 ))}
            </Grid>
            </Grid>
            <Grid xs={2} item></Grid>
                    {/* Cart Items */}
             <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>My Shopping Cart
                    <Select
                        value={currency}
                        onChange={handleChange}
                        >
                            {CurrencyData.data.currency.map(cl =>(
                                <MenuItem value={cl}>{cl}</MenuItem>
                            ))}
                    </Select>
                    <Button onClick={handleClose}>X</Button>
                </DialogTitle>
                <DialogContent>
                    {cart.map((item) => (
                    <Card sx={{ maxWidth: 345 }}>
                        <Button onClick={() => removeFromCart(item)}>x</Button>
                        <CardMedia
                            component="img"
                            height="140"
                            image={item.image_url}
                            alt={item.title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="body2" component="div">
                                {item.title}
                            </Typography>
                            
                        </CardContent>
                        <CardActions>
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button>+</Button>
                                <Button>1</Button>
                                <Button>-</Button>
                            </ButtonGroup>
                            <Typography variant="body2" color="text.secondary">
                            {item.price}
                            </Typography>
                        </CardActions>
                    </Card>
                    ))}
                </DialogContent>
                <DialogActions>
                <div>SUBTOTAL: {currency} {cartTotal}</div>
                <Button onClick={handleClose}>PROCEED TO CHECKOUT</Button>
                </DialogActions>
            </Dialog>
            </Grid>
            </Box>
        </div>
    );
};
export default Products;