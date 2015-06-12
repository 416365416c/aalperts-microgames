#include <QtDeclarative>
#include <QApplication>

int main(int argc, char* argv[])
{
    QApplication app(argc, argv);
    QDeclarativeView view;
    QUrl uiFile = QUrl("qrc:qml/main.qml");
    view.setSource(uiFile);
    view.show();
    //I thought QDeclarativeView did this already?
    QObject::connect(view.engine(), SIGNAL(quit()), &app, SLOT(quit()));
    return app.exec();
}
