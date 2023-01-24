import React, { useState } from "react";

import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { Divider, Fab, List, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from "@mui/material";
import { orange } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";

export type SidebarButtonProps = {};

export type SidebarButtonComponent = React.FunctionComponent<SidebarButtonProps>;

export const SidebarButton: SidebarButtonComponent = (): JSX.Element => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const conflicts = useStore(({ conflicts }) => conflicts);
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
                    {conflicts.length > 0 && (
                        <>
                            <Divider />
                            <ListItemButton onClick={() => navigate("/conflicts")} sx={{ background: orange[100] }}>
                                <ListItemIcon>
                                    <BrokenImageIcon />
                                </ListItemIcon>
                                <ListItemText primary="Conflicts" secondary={`${conflicts.length} to review`} />
                            </ListItemButton>
                        </>
                    )}
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
