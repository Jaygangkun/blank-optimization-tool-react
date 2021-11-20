import { CNavItem, CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';

function AppSidebar() {

    return (
        <CSidebar overlaid={true}>
            <CSidebarBrand>Blank Optimization Tool</CSidebarBrand>
            <CSidebarNav>
            <CNavItem href="#"><CIcon customClassName="nav-icon" icon={icon.cilFolder} />Document</CNavItem>
            <CNavItem href="#"><CIcon customClassName="nav-icon" icon={icon.cilPrint} />Print</CNavItem>
            <CNavItem href="#"><CIcon customClassName="nav-icon" icon={icon.cilFolder} />Clear</CNavItem>
            <CNavItem href="#"><CIcon customClassName="nav-icon" icon={icon.cilFolder} />Options</CNavItem>
            <CNavItem href="#"><CIcon customClassName="nav-icon" icon={icon.cilFolder} />Upload Files</CNavItem>
            </CSidebarNav>
        </CSidebar>
    )
}

export default AppSidebar;