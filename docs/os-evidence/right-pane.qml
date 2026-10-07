/**
 * notifications.qml
 *
 * Copyright (C) 2016-2019 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU GPL v2
 *
 * Manages the widgets shown in the updates view
 */


import QtQuick 2.3
import Updates 1.0

import KanoDashboard.Widgets.Templates 1.0 as Templates
import KanoDashboard.Widgets.LatestView 1.0 as LatestView


Templates.ContentWidget {
    id: notifications
    color: 'transparent'
    anchors.margins: 0

    Updates {
        id: updates
        onPackages_available: reload()
        onMajor_update_installable: reload()
        onMuted_update: reload()
    }

    Component {
        id: live_tiles
        LatestView.LiveTiles {}
    }

    Component {
        id: major_update
        LatestView.MajorUpdateNotification {
            onMuted_update: updates.update_muted = true
            guide_height: notifications.guide_height
        }
    }

    Component {
        id: pkg_updates
        LatestView.UpdateNotifications {
            onMuted_update: updates.update_muted = true
            guide_height: notifications.guide_height
        }
    }

    Component {
        id: no_internet
        LatestView.NoInternet {
            guide_height: notifications.guide_height
        }
    }

    Component {
        id: no_profile
        LatestView.NoProfile {
            guide_height: notifications.guide_height
        }
    }

    Component {
        id: not_verified
        LatestView.NotVerified {
            guide_height: notifications.guide_height
        }
    }

    Loader {
        id: view_loader
        anchors.fill: parent
        anchors.margins: 0
    }

    function reload() {
        var view = live_tiles;

        if (!kano_networking.internet_available) {
            view = no_internet;
        } else if (updates.major_update_installable && !updates.update_muted) {
            view = major_update;
        } else if (updates.packages_available.length > 0 && !updates.update_muted) {
            view = pkg_updates;
        } else if (!q_kano_world.is_registered()) {
            view = no_profile;
        } else if (!q_kano_world.is_account_verified()) {
            view = not_verified;
        }

        view_loader.sourceComponent = view;
    }
    onUpdate: {
        reload();
        q_kano_world.refresh_account_verification_async();
    }

    Connections {
        target: q_kano_world
        onAccountVerificationChanged: reload()
    }

    Component.onCompleted: {
        reload();
        app_state.refresh.connect(reload);
        kano_networking.internet_status_change.connect(reload);
        q_kano_world.refresh_account_verification_async();
    }

}
