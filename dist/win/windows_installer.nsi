# Should be overwritten with win32/win64 from command line
!define PLATFORM "win32"

# Request application privileges
RequestExecutionLevel user

# Include Modern UI
!include "MUI2.nsh"

# Parse package.json
!searchparse /file "../../package.json" '"name": "' APP_NAME '",'
!searchparse /file "../../package.json" '"version": "' APP_VERSION '",'

# general settings
Name "${APP_NAME}"
OutFile "../../releases/win/${APP_NAME}-${APP_VERSION}-win-Setup.exe"

# Default installation folder
InstallDir "$LOCALAPPDATA\${APP_NAME}"

# Define UI settings
!define MUI_UI_HEADERIMAGE_RIGHT "../icon.png"
!define MUI_ICON "../icon.ico"
!define MUI_UNICON "../icon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "installer-image.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "uninstaller-image.bmp"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\Monolist.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Run after installing"

# Define install pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

# Define uninstall pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

# Load Language Files
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "French"
!insertmacro MUI_LANGUAGE "Spanish"

# App
Section

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  # these are the Windows files produced by grunt-node-webkit-builder
  File "../../webkitbuilds/${APP_NAME}/${PLATFORM}/ffmpegsumo.dll"
  File "../../webkitbuilds/${APP_NAME}/${PLATFORM}/icudtl.dat"
  File "../../webkitbuilds/${APP_NAME}/${PLATFORM}/libEGL.dll"
  File "../../webkitbuilds/${APP_NAME}/${PLATFORM}/libGLESv2.dll"
  File "../../webkitbuilds/${APP_NAME}/${PLATFORM}/nw.pak"
  File "../icon.ico"
  File "../../webkitbuilds/${APP_NAME}/${PLATFORM}/${APP_NAME}.exe"

  # define the uninstaller name
  WriteUninstaller $INSTDIR\${APP_NAME}-Uninstaller.exe

  # create a shortcut named 'Monolist' in the start menu
  # point the shortcute at Monolist.exe
  CreateShortCut "$SMPROGRAMS\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe"

SectionEnd


# Shortcuts
Section

    # Working Directory
    SetOutPath "$INSTDIR"

    CreateShortCut "$INSTDIR\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe" "." "$INSTDIR\icon.ico" "" "" "" "${APP_NAME}"

    # Start Menu Shortcut
    RMDir /r "$SMPROGRAMS\${APP_NAME}"
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe" "." "$INSTDIR\icon.ico" "" "" "" "${APP_NAME} ${APP_VERSION}"
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\Uninstall ${APP_NAME}.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\icon.ico" "" "" "" "Uninstall ${APP_NAME}"

    # Desktop Shortcut
    Delete "$DESKTOP\${APP_NAME}.lnk"
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe" "." "$INSTDIR\icon.ico" "" "" "" "${APP_NAME} ${APP_VERSION}"

SectionEnd

# Uninstaller
Section "uninstall"

  # delete the uninstaller
  Delete $INSTDIR\${APP_NAME}-${PLATFORM}-uninstaller.exe

  # delete the installed files
  Delete $INSTDIR\ffmpegsumo.dll
  Delete $INSTDIR\icudtl.dat
  Delete $INSTDIR\libEGL.dll
  Delete $INSTDIR\libGLESv2.dll
  Delete $INSTDIR\nw.pak
  Delete $INSTDIR\${APP_NAME}.exe
  Delete $INSTDIR\icon.ico
  Delete $SMPROGRAMS\${APP_NAME}.lnk
  Delete $INSTDIR

SectionEnd