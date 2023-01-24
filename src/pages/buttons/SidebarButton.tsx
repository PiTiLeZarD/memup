import React, { useState } from "react";

import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { Fab, List, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from "@mui/material";
import { useNavigate } from "react-router-dom";

export type SidebarButtonProps = {};

export type SidebarButtonComponent = React.FunctionComponent<SidebarButtonProps>;

export const SidebarButton: SidebarButtonComponent = (): JSX.Element => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <>
            <SwipeableDrawer
                anchor="left"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpen={() => setSidebarOpen(true)}
            >
                <List sx={{ minWidth: "280px" }}>
                    <ListItemButton onClick={() => navigate("/about")}>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate("/mems")}>
                        <ListItemIcon>
                            <HistoryEduIcon />
                        </ListItemIcon>
                        <ListItemText primary="List mems" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate("/settings")}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate("/importbackup")}>
                        <ListItemIcon>
                            <ImportExportIcon />
                        </ListItemIcon>
                        <ListItemText primary="Import/Backup" />
                    </ListItemButton>
                </List>
            </SwipeableDrawer>
            <Fab
                onClick={() => setSidebarOpen(true)}
                color="primary"
                sx={{ position: "absolute", top: "-30px", left: "-25px" }}
            >
                <MenuIcon />
            </Fab>
        </>
    );
};
