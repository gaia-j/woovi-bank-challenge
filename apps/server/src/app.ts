import Koa, { Context } from 'koa';
import Router from "@koa/router";
import {getGraphQLParameters, processRequest, renderGraphiQL, sendResult, shouldRenderGraphiQL} from "graphql-helix";
import bodyParser from 'koa-bodyparser';
import {schema} from "./schema";


const router = new Router();

const app = new Koa()

app.use(bodyParser())

router.all("/graphql", async (ctx: Context) => {
    const request = {
        body: ctx.request.body,
        headers: ctx.req.headers,
        method: ctx.request.method,
        query: ctx.request.query,
    };

    if (shouldRenderGraphiQL(request)) {
        ctx.body = renderGraphiQL({});
    } else {
        const { operationName, query, variables } = getGraphQLParameters(request);

        const result = await processRequest({
            operationName,
            query,
            variables,
            request,
            schema,
        });

        ctx.respond = false;
        sendResult(result, ctx.res);
    }
})


app.use(router.routes()).use(router.allowedMethods())

export default app