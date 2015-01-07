# Should be overwritten with win32/win64 from command line
!define PLATFORM "win64"

# Include Modern UI
!include "MUI2.nsh"

# Parse package.json
!searchparse /file "../../package.json" '"name": "' APP_NAME '",'
!searchparse /file "../../package.json" '"version": "' APP_VERSION '",'

# general settings
Name "${APP_NAME}"
OutFile "../../releases/win/${APP_NAME}-${APP_VERSION}-${PLATFORM}-Setup.exe"

# Define UI settings
!define MUI_UI_HEADERIMAGE_RIGHT "../icon.png"
!define MUI_ICON "../icon.ico"
!define MUI_UNICON "../icon.ico"

!define MUI_WELCOMEFINISHPAGE_BITMAP "./installer-image.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "./uninstaller-image.bmp"
!define MUI_ABORTWARNING

# default section start
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
  File "../../webkitbuilds/${APP_NAME}/${PLATFORM}/${APP_NAME}.exe"

  # define the uninstaller name
  WriteUninstaller $INSTDIR\${APP_NAME}-Uninstaller.exe

  # create a shortcut named 'Monolist' in the start menu
  # point the shortcute at Monolist.exe
  CreateShortCut "$SMPROGRAMS\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the uninstaller
  Delete $INSTDIR\${APP_NAME}-${PLATFORM}-uninstaller.exe

  # delete the installed files
  Delete $INSTDIR\ffmpegsumo.dll
  Delete $INSTDIR\icudtl.dat
  Delete $INSTDIR\libEGL.dll
  Delete $INSTDIR\libGLESv2.dll
  Delete $INSTDIR\nw.pak
  Delete $INSTDIR\${APP_NAME}.exe
  Delete $SMPROGRAMS\${APP_NAME}.lnk
  Delete $INSTDIR

SectionEnd