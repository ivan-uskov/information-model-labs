var Grass = ObjectElement.extend({
    /* 0 = decrease | ! = increase */
    _state: null,
    _currentSizeClass: null,

    constructor: function(elementId)
    {
        this.base(elementId);

        this._state = Grass.STATE_VALUES.NONE;
    },

    _increaseLevel: function()
    {
        var level = this.getLevel();
        var canIncrease = (level < Grass.LEVEL_SIZES.MAX_LEVEL);
        if (canIncrease)
        {
            this.setLevel(++level);
            this.update();
        }
        return canIncrease;
    },

    _decreaseLevel: function()
    {
        var level = this.getLevel();
        var canDecrease = (level > Grass.LEVEL_SIZES.MIN_LEVEL);
        if (canDecrease)
        {
            this.setLevel(--level);
            this.update();
        }
        return canDecrease;
    },

    _setMinLevel: function()
    {
        this.setLevel(WeatherElement.LEVEL_SIZES.MIN_LEVEL);
    },

    _setMaxLevel: function()
    {
        this.setLevel(WeatherElement.LEVEL_SIZES.MAX_LEVEL);
    },

    _changeLevelByState: function()
    {
        switch (this._state)
        {
            case Grass.STATE_VALUES.INCREASE:
                this._increaseLevel();
                break;
            case Grass.STATE_VALUES.DECREASE:
                this._decreaseLevel();
                break;
            case Grass.STATE_VALUES.NONE:
                break;
            case Grass.STATE_VALUES.DEAD:
                this._setMinLevel();
                break;
            default:
                console.log('Grass state error');
        }
    },

    _checkNeedStateIncrease: function(sunLevel, rainLevel)
    {
        return (rainLevel == 1 && sunLevel == 1) ||
               (rainLevel == 2 && sunLevel == 1) ||
               (rainLevel == 1 && sunLevel == 2) ||
               (rainLevel == 2 && sunLevel == 2) ||
               (rainLevel == 3 && sunLevel == 2) ||
               (rainLevel == 2 && sunLevel == 3) ||
               (rainLevel == 3 && sunLevel == 3);
    },

    _checkNeedStateDecrease: function(sunLevel, rainLevel)
    {
        return (rainLevel == 0 && sunLevel == 3);
    },

    _checkNeedStateNone: function(sunLevel, rainLevel)
    {
        return (rainLevel == 0 && sunLevel == 0) ||
               (rainLevel == 1 && sunLevel == 0) ||
               (rainLevel == 2 && sunLevel == 0) ||
               (rainLevel == 0 && sunLevel == 1) ||
               (rainLevel == 3 && sunLevel == 1) ||
               (rainLevel == 0 && sunLevel == 2) ||
               (rainLevel == 1 && sunLevel == 3);
    },

    _checkNeedStateDead: function(sunLevel, rainLevel)
    {
        return (rainLevel == 3 && sunLevel == 0);
    },

    _changeStateBySunRainLevel: function(sunLevel, rainLevel)
    {
        if (this._checkNeedStateIncrease(sunLevel, rainLevel))
        {
            this._state = Grass.STATE_VALUES.INCREASE;
        }
        else if (this._checkNeedStateDecrease(sunLevel, rainLevel))
        {
            this._state = Grass.STATE_VALUES.DECREASE;
        }
        else if (this._checkNeedStateDead(sunLevel, rainLevel))
        {
            this._state = Grass.STATE_VALUES.DEAD;
        }
        else if (this._checkNeedStateNone(sunLevel, rainLevel))
        {
            this._state = Grass.STATE_VALUES.NONE;
        }
    },

    update: function()
    {
        this.updateLevelCssClass();
    },

    render: function(sunLevel, rainLevel)
    {
        this._changeLevelByState();
        this._changeStateBySunRainLevel(sunLevel, rainLevel);
        this.update();
    }
},
{
    LEVEL_SIZES:
    {
        MIN_LEVEL: 0,
        MAX_LEVEL: 4
    },

    STATE_VALUES:
    {
        DECREASE: 0,
        INCREASE: 1,
        NONE:     2,
        DEAD:     3
    },

    CSS_DEFAULT_CLASS: 'grass'
});