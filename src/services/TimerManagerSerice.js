/* eslint-disable */
import dayJS from 'dayjs';
import Logger from '../services/loggerService';

class TimerManager {
    constructor() {
      this.timers = {};
    }

    addTimer(id, func, time, units) {
        try
        {
            if(this.timers[id] != undefined)
            {
                clearTimeout(this.timers[id].timer);
            }

            this.timers[id] = {};
            this.timers[id].timer = setTimeout(func, this.unitConvert(time, units));
            this.timers[id].func = func;
            this.timers[id].time = dayJS().add(time, units);
            
            Logger.classe(this.constructor.name)
                .metodo('addTimer')
                .mensagem(`Adicionado Timer: ${id}`)
                .parametros([id, func, time, units])
                .info();
        }
        catch(e) {
            Logger.classe(this.constructor.name)
                .metodo('addTimer')
                .mensagem(e.message)
                .parametros([id, func, time, units])
                .error();
        }
    }

    addTimerLoop(id, func, cond, time, units) {
        return new Promise((resolve, reject) => {
            try
            {
                if(this.timers[id] != undefined)
                {
                    clearTimeout(this.timers[id].timer);
                }
                
                if(cond()) {
                    this.timers[id] = {};
                    this.timers[id].timer = setTimeout(() => {
                        func();
                        this.addTimerLoop(id, func, cond, time, units);
                    }, this.unitConvert(time, units));
                    this.timers[id].func = func;
                    this.timers[id].time = dayJS().add(time, units);
                }
                else {
                    Logger.classe(this.constructor.name)
                        .metodo('addTimerLoop')
                        .mensagem(`Adicionado Timer: ${id}`)
                        .parametros([id, func, time, units])
                        .info();
                    resolve();
                }
            }
            catch(e) {
                Logger.classe(this.constructor.name)
                    .metodo('addTimer')
                    .mensagem(e.message)
                    .parametros([id, func, time, units])
                    .error();
                reject(e);
            }
        })
    }

    removeTimer(id) {
        try
        {
            if(this.timers[id].timer !== undefined)
                clearTimeout(this.timers[id].timer);
            
            Logger.classe(this.constructor.name)
                .metodo('removeTimer')
                .mensagem(`Timer Removido: ${id}`)
                .parametros([id, func, time, units])
                .info();
        }
        catch(e) {
            Logger.classe(this.constructor.name)
                .metodo('removeTimer')
                .mensagem(e.message)
                .parametros([id, func, time, units])
                .error();
        }
    }

    removeAllTimers() {
        for(let id in this.timers) {
            clearTimeout(this.timers[id].timer);
        }

        Logger.classe(this.constructor.name)
                .metodo('removeAllTimers')
                .mensagem(`Todos os timers removidos`)
                .parametros([id, func, time, units])
                .info();
    }

    unitConvert(time, units) {
        if(units === 'seconds') {
            return time * 1000;
        }

        if(units === 'minutes') {
            return time * 1000 * 60;
        }
        
        if(units === 'hours') {
            return time * 1000 * 60 * 60;
        }

        if(units === 'hours') {
            return time * 1000 * 60 * 60 * 24;
        }
        
        return time;
    }
}
 
export default new TimerManager();