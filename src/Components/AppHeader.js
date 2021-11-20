import { CHeader, CHeaderNav, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CImage } from '@coreui/react'

function AppHeader() {
    return (
        <CHeader className="justify-content-end">
            <CHeaderNav>
                <CDropdown variant="nav-item">
                    <CDropdownToggle color="secondary"><CImage src="/profile.svg" width={32} height={32} /></CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem href="#">Log out</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CHeaderNav>
        </CHeader>
    )
}

export default AppHeader;