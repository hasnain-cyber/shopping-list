import {Box, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import {FormEvent, useEffect, useState} from "react";
import './AddShop.scss'
import {useHistory} from "react-router-dom";
import {addItem, modifyItem, store, storeItemType} from "../../index";

export const AREAS = [
    {
        name: 'THANE',
        value: 0
    }, {
        name: 'PUNE',
        value: 1
    }, {
        name: 'NASHIK',
        value: 2
    }, {
        name: 'NAGPUR',
        value: 3
    }, {
        name: 'AHMEDABAD',
        value: 4
    }, {
        name: 'SOLAPUR',
        value: 5
    }
]

export const CATEGORIES = [
    {
        name: 'GROCERY',
        value: 0
    }, {
        name: 'BUTCHER',
        value: 1
    }, {
        name: 'BAKER',
        value: 2
    }, {
        name: 'CHEMIST',
        value: 3
    }, {
        name: 'STATIONERY',
        value: 4
    }
]

const characterStringRegex = new RegExp('^[a-zA-Z ]*$')

const AddShop = (props: { modifyName: string, setModifyName: Function }) => {
    const [shopName, setShopName] = useState('')
    const [area, setArea] = useState('')
    const [category, setCategory] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [openDateWarning, setOpenDateWarning] = useState(false)

    const history = useHistory()

    useEffect(() => {
        if (props.modifyName !== '') {
            const shopObject = store.getState().find(element => element.shopName === props.modifyName)
            if (shopObject) {
                setShopName(shopObject.shopName)
                setArea(shopObject.area.toString())
                setCategory(shopObject.category.toString())
                setStartDate(shopObject.startDate)
                setEndDate(shopObject.endDate)
            }
        }
    }, [props.modifyName])

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()

        if (Date.parse(endDate) > Date.parse(startDate)) {
            const dataObject: storeItemType = {
                shopName,
                area: parseInt(area),
                category: parseInt(category),
                startDate,
                endDate
            }
            if (props.modifyName === '') {
                store.dispatch(addItem(dataObject))
            } else {
                store.dispatch(modifyItem(props.modifyName, dataObject))
                props.setModifyName('')
            }
            history.goBack()
        } else {
            setOpenDateWarning(true)
        }
    }

    const DateField = (props: { dateValue: any, setDateValue: any }) => {
        return (
            <TextField required variant={'outlined'} type={'date'} value={props.dateValue}
                       onChange={event => {
                           props.setDateValue(event.target.value)
                       }}/>
        )
    }

    return (
        <>
            <Navbar/>

            {/*date warning*/}
            <Snackbar
                open={openDateWarning}
                autoHideDuration={3000}
                onClose={() => setOpenDateWarning(false)}
                message="The closing date must be after the opening date!"
            />

            <Box padding={'2%'} marginTop={'10vh'}>
                <Typography fontFamily={'Oswald'} fontSize={30} textAlign={'center'}
                            sx={{textDecoration: 'underline'}}>ADD
                    SHOP</Typography>
                <form style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15,
                    margin: 'auto',
                    padding: '2%',
                    maxWidth: 500,
                }}
                      onSubmit={onSubmit}>
                    <TextField required value={shopName} label={'SHOP NAME'} onChange={event => {
                        const newString = event.target.value

                        // check for only characters.
                        if (characterStringRegex.test(newString)) {
                            setShopName(newString)
                        }
                    }}/>
                    <FormControl>
                        <InputLabel htmlFor={'select'}>AREA</InputLabel>
                        <Select name={'select'} label={'AREA'} required value={area} onChange={event => {
                            setArea(event.target.value)
                        }}>
                            {AREAS.map(element => <MenuItem key={element.value}
                                                            value={element.value}>{element.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor={'select'}>CATEGORY</InputLabel>
                        <Select name={'select'} label={'CATEGORY'} required value={category} onChange={event => {
                            setCategory(event.target.value)
                        }}>
                            {CATEGORIES.map(element => <MenuItem key={element.value}
                                                                 value={element.value}>{element.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <DateField dateValue={startDate} setDateValue={setStartDate}/>
                    <DateField dateValue={endDate} setDateValue={setEndDate}/>
                    <button className={'form-submit-button'}>Confirm</button>
                </form>
            </Box>
        </>
    )
}

export default AddShop
