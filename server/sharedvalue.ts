// sharedValue.ts
import { Mutex } from 'async-mutex';

let sharedValue: any[] = [];
const mutex = new Mutex();

export async function getSharedValue(): Promise<any[]> {
    const release = await mutex.acquire();
    const sended = sharedValue
    try {
        //if(sharedValue[0]!=null) console.log(sharedValue)
        sharedValue = []
        return sended;
    } finally {
        release();
    }
}

export async function pushIntoSharedValue(newValue: any[]): Promise<void> {
    const release = await mutex.acquire();
    try {
        sharedValue.push(newValue);
    } finally {
        release();
    }
}