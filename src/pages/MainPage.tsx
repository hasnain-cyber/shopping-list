import Navbar from "../components/Navbar/Navbar";
import {Box, Checkbox, Divider, Drawer, IconButton, List, ListItem, ListSubheader, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {deleteItem, store, storeItemType} from "../index";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import {AREAS, CATEGORIES} from "./AddShop/AddShop";
import {useHistory} from "react-router-dom";

const SUBHEADER_TITLES = {
    AREA: 'AREA',
    CATEGORIES: 'CATEGORIES'
}

interface elementType {
    name: string,
    value: number,
    checked: boolean
}

interface filterBooleanListType {
    areasList: Array<elementType>,
    categoriesList: Array<elementType>
}

const MainPage = (props: { setModifyName: Function }) => {
    const [shopList, setShopList] = useState<storeItemType[]>([]);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false)
    const [filterBooleanList, setFilterBooleanList] = useState<filterBooleanListType>({
        areasList: [],
        categoriesList: []
    })
    const [openCloseFilter, setOpenCloseFilter] = useState(false)
    const [displayList, setDisplayList] = useState<Array<any>>([])

    const history = useHistory()

    useEffect(() => {
        // modify the main areas and categories list to handle filter checkboxes
        setFilterBooleanList({
            areasList: AREAS.map(element => Object.assign(element, {checked: false})),
            categoriesList: CATEGORIES.map(element => Object.assign(element, {checked: false})),
        })

        // handling redux logic
        setShopList(store.getState())
        return store.subscribe(() => {
            setShopList(store.getState())
        })
    }, [])

    useEffect(() => {
        const allowedAreas = filterBooleanList.areasList.filter(element => element.checked).map(element => element.value)
        const allowedCategories = filterBooleanList.categoriesList.filter(element => element.checked).map(element => element.value)

        let areasList = shopList
        if (allowedAreas.length > 0) {
            areasList = shopList
                .filter(element => allowedAreas.includes(element.area))
        }
        let categoriesList = shopList
        if (allowedCategories.length > 0) {
            categoriesList = shopList
                .filter(element => allowedCategories.includes(element.category))
        }
        let openCloseList = shopList
        if (openCloseFilter) {
            openCloseList = shopList.filter(element => Date.parse(element.startDate) < Date.now() && Date.now() < Date.parse(element.endDate))
        }
        const commonList =
            areasList.filter(element => categoriesList.includes(element))
                .filter(element => openCloseList.includes(element))
        setDisplayList(
            commonList.map(element =>
                <Box key={element.shopName} display={'flex'} justifyContent={'space-between'} alignItems={'center'}
                     borderBottom={1}
                     paddingX={'3%'} paddingY={'1%'}>
                    <Box display={'flex'} flex={1} justifyContent={'center'}>
                        <Typography variant={'body1'} fontFamily={'Prompt'} textAlign={'center'}
                                    fontSize={18}>{element.shopName}</Typography>
                    </Box>
                    <Box display={'flex'} flex={1} justifyContent={'center'}>
                        <Typography variant={'body1'} fontFamily={'Prompt'} textAlign={'center'}
                                    fontSize={18}>{AREAS.find(testElement => testElement.value === element.area)?.name}</Typography>
                    </Box>
                    <Box display={'flex'} flex={1} justifyContent={'center'}>
                        <Typography variant={'body1'} fontFamily={'Prompt'} textAlign={'center'}
                                    fontSize={18}>{CATEGORIES.find(testElement => testElement.value === element.category)?.name}</Typography>
                    </Box>
                    <Box display={'flex'} flex={1} justifyContent={'center'}>
                        <IconButton
                            onClick={() => store.dispatch(deleteItem(element.shopName))}>
                            <DeleteIcon/>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                props.setModifyName(element.shopName)
                                history.push('/addShop')
                            }}>
                            <ChangeCircleIcon/>
                        </IconButton>
                    </Box>
                </Box>
            ))
    }, [filterBooleanList.areasList, filterBooleanList.categoriesList, history, openCloseFilter, props, shopList])

    const handleCheckboxFlip = (subheaderTitle: string, elementName: string) => {
        switch (subheaderTitle) {
            case (SUBHEADER_TITLES.AREA):
                setFilterBooleanList({
                    areasList: filterBooleanList.areasList.map(element => {
                        if (element.name === elementName) {
                            element.checked = !element.checked
                            return element
                        } else {
                            return element
                        }
                    }),
                    categoriesList: filterBooleanList.categoriesList,
                })
                break
            case(SUBHEADER_TITLES.CATEGORIES):
                setFilterBooleanList({
                    areasList: filterBooleanList.areasList,
                    categoriesList: filterBooleanList.categoriesList.map(element => {
                        if (element.name === elementName) {
                            element.checked = !element.checked
                            return element
                        } else {
                            return element
                        }
                    })
                })
                break
        }
    }

    const DrawerList = (subHeaderTitle: string, listOptions: any) => {
        return (
            <List>
                <ListSubheader
                    sx={{
                        fontFamily: "Oswald",
                        fontSize: 20,
                        textDecoration: "underline",
                        textAlign: "center",
                    }}
                    color="primary"
                >
                    {subHeaderTitle}
                </ListSubheader>
                {listOptions.map((element: { value: number; name: string; checked: boolean; }) => {
                        return <ListItem key={element.name}
                                         sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography>{element.name}</Typography>
                            <Checkbox checked={element.checked}
                                      onChange={() => handleCheckboxFlip(subHeaderTitle, element.name)}/>
                        </ListItem>
                    }
                )}
            </List>
        )
    }

    return (
        <>
            <Navbar/>

            {/*extra options bar*/}
            <Box borderBottom={1} display={'flex'} paddingX={2} justifyContent={'end'}>
                <IconButton onClick={() => setOpenFilterDrawer(!openFilterDrawer)}>
                    <FilterAltIcon/>
                </IconButton>

                <Drawer
                    sx={{
                        width: "100vw",
                        maxWidth: 300,
                        "& .MuiDrawer-paper": {
                            width: "100vw",
                            maxWidth: 300,
                        },
                    }}
                    variant="temporary"
                    anchor="left"
                    open={openFilterDrawer}
                    onClose={() => setOpenFilterDrawer(false)}
                >
                    <Box display={"flex"} justifyContent={"end"}>
                        <IconButton onClick={() => setOpenFilterDrawer(false)}>
                            <KeyboardArrowLeftIcon/>
                        </IconButton>
                    </Box>
                    <Divider/>

                    <>
                        {filterBooleanList.areasList ? DrawerList(SUBHEADER_TITLES.AREA, filterBooleanList.areasList) : null}
                        {filterBooleanList.categoriesList ? DrawerList(SUBHEADER_TITLES.CATEGORIES, filterBooleanList.categoriesList) : null}
                        <List>
                            <ListSubheader
                                sx={{
                                    fontFamily: "Oswald",
                                    fontSize: 20,
                                    textDecoration: "underline",
                                    textAlign: "center",
                                }}
                                color="primary"
                            >
                                Miscellaneous
                            </ListSubheader>
                            <ListItem key={'OPEN/CLOSE DATE'}
                                      sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Typography>OPEN/CLOSE DATE</Typography>
                                <Checkbox checked={openCloseFilter}
                                          onChange={() => setOpenCloseFilter(!openCloseFilter)}/>
                            </ListItem>
                        </List>
                    </>
                </Drawer>
            </Box>
            {displayList.length > 0 ?
                <>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={1}
                         paddingX={'3%'} paddingY={'1%'} bgcolor={'#59201f'}>
                        {['NAME', 'AREA', 'CATEGORY', 'OPTIONS'].map(element =>
                            <Box key={element} display={'flex'} flex={1} justifyContent={'center'}>
                                <Typography variant={'body1'}
                                            fontFamily={'Prompt'}
                                            fontSize={18}
                                            color={'white'}>
                                    {element}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <List>
                        {displayList}
                    </List>
                </>
                :
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} position={'absolute'} top={'50%'}
                     left={'50%'} sx={{transform: 'translate(-50%, -50%)'}}>
                    <AddShoppingCartIcon sx={{fontSize: '100px'}}/>
                    <Typography variant={'h4'} fontFamily={'Oswald'} textAlign={'center'}>NO SHOPS
                        AVAILABLE!</Typography>
                </Box>
            }
        </>
    )
}

export default MainPage
