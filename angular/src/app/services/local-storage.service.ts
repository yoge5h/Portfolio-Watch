export class LocalStorageService{
    store(key: string, value: string){
        localStorage.setItem(key, value);
    }
    get(key: string, defaultValue: string = ''){
        return localStorage.getItem(key) || defaultValue;
    }
    storeObject(key: string, value:{}){
        localStorage.setItem(key, JSON.stringify(value));
    }
    getObject(key: string, defaultValue: string = '{}'){
        return JSON.parse(localStorage.getItem(key) || defaultValue);
    }
}