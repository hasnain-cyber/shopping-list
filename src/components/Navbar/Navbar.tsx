import {AppBar, Box, Typography} from "@mui/material";
import {Link} from 'react-router-dom'
import './Navbar.scss'

const Navbar = () => {
    return (
        <AppBar position={'sticky'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} paddingX={3} paddingY={1}>
                <Link to={'/'}><Typography variant={'h4'} fontFamily={'Oswald'}>SHOPPY</Typography></Link>

                {/*rhs*/}
                <Box display={'flex'} gap={3}>
                    <Link className={'navbar-links'} to={'/'}>HOME</Link>
                    <Link className={'navbar-links'} to={'/addShop'}>ADD SHOP</Link>
                </Box>
            </Box>
        </AppBar>
    )
}

export default Navbar
