export namespace main {
	
	export class Config {
	    page: string;
	    token: string;
	    prefix: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.page = source["page"];
	        this.token = source["token"];
	        this.prefix = source["prefix"];
	    }
	}

}

