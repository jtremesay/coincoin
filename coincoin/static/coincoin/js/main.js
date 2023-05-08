$(function () {
    var ToDoItemWidget = function (config) {
        config = config || {};
        ToDoItemWidget.super.call(this, config);

        this.creationTime = config.creationTime;

        this.deleteButton = new OO.ui.ButtonWidget({
            label: 'Delete'
        });

        this.$element
            .addClass('todo-itemWidget')
            .append(this.deleteButton.$element);

        this.deleteButton.connect(this, {
            click: 'onDeleteButtonClick'
        });
    };

    OO.inheritClass(ToDoItemWidget, OO.ui.OptionWidget);

    ToDoItemWidget.prototype.getCreationTime = function () {
        return this.creationTime;
    };

    ToDoItemWidget.prototype.getPrettyCreationTime = function () {
        var time = new Date(this.creationTime),
            hour = time.getHours(),
            minute = time.getMinutes(),
            second = time.getSeconds(),
            temp = String((hour > 12) ? hour - 12 : hour),
            monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ];

        if (hour === 0) {
            temp = '12';
        }
        temp += ((minute < 10) ? ':0' : ':') + minute;
        temp += ((second < 10) ? ':0' : ':') + second;
        temp += (hour >= 12) ? ' P.M.' : ' A.M.';
        return [
            time.getDate(),
            monthNames[time.getMonth()],
            time.getFullYear() + ', ',
            temp
        ].join(' ');
    };

    ToDoItemWidget.prototype.onDeleteButtonClick = function () {
        this.emit('delete');
    };

    var ToDoListWidget = function ToDoListWidget(config) {
        config = config || {};

        // Call parent constructor
        ToDoListWidget.super.call(this, config);

        this.aggregate({
            delete: 'itemDelete'
        });

        this.connect(this, {
            itemDelete: 'onItemDelete'
        });
    };

    OO.inheritClass(ToDoListWidget, OO.ui.SelectWidget);

    ToDoListWidget.prototype.onItemDelete = function (itemWidget) {
        this.removeItems([itemWidget]);
    };

    var input = new OO.ui.TextInputWidget({
        placeholder: 'Add a ToDo item'
    }),
        list = new ToDoListWidget({
            classes: ['todo-list']
        }),
        info = new OO.ui.LabelWidget({
            label: 'Information',
            classes: ['todo-info']
        });

    // Respond to 'enter' keypress
    input.on('enter', function () {
        // Check for duplicates and prevent empty input
        if (list.findItemFromData(input.getValue()) ||
            input.getValue() === '') {
            input.$element.addClass('todo-error');
            return;
        }
        input.$element.removeClass('todo-error');

        list.on('choose', function (item) {
            info.setLabel(item.getData() + ' (' +
                item.getPrettyCreationTime() + ')');
        });

        // Add the item
        list.addItems([
            new ToDoItemWidget({
                data: input.getValue(),
                label: input.getValue(),
                creationTime: Date.now()
            })
        ]);
        input.setValue('');
    });

    // Append the app widgets
    $('.wrapper').append(
        input.$element,
        list.$element,
        info.$element
    );
});
