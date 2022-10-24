import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from 'axios';
import * as url from 'url';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    context.log('Incoming URL', req.url);
    context.log('Relative URL', url.parse(req.url).pathname);

    try {
        const res = await axios.get(url.parse(req.url).pathname);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: res.data
        };
    }
    catch(err) {
        context.log.error('ERROR', err);
        throw err;
    }
};

export default httpTrigger;