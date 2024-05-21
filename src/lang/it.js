import { text } from "@fortawesome/fontawesome-svg-core";

export const it = {

    action:{
        accept:"Accetta",
        postponi:"Più tardi",
        declina:"Declina",
        cancel:"Annulla",
        download:"Scarica",
        app:"Apri in App",
        salta:"Salta",
        close:"Chiudi",
        riprova:"Riprova"
    },
    onboard:{
        lang:{
            title:"Scegli",
            text:"in quale lingua preferisci ascoltare i contenuti?"
        },
        percorsi:{
            title:"Scegli ",
            text:"il percorso che vuoi seguire"
        },
        tag:{
            title:"Avvicina lo smartphone ai SilenceTag",
            text:"Utilizza l'APP per accedere ai contenuti di approfondimento"
        },
        qr:{
            alternative:"Oppure",
            title:"Scansiona",
            text:"Inquadra i QR Code che troverai lungo il percorso"
        },


    },
    networkerror:{
		title:"Errore di rete",
        text:"Impossibile scaricare i contenuti, non sarà possibile utilizzare l'app in modalità offline!",
        action:"Riprova più tardi"
    },
    storageError:{
		title:"Spazio insufficiente",
        text:"Non è possibile scaricare tutti i contenuti, utilizzare l'app in modalità online!",
        action:"Ok"
    },
    update:{
		title:"Aggiornamento",
        text:"Sono disponibili nuovi contenuti, aggiornali prima di usare l'app"
    },
    scarica:{
		title:"Scaricamento dei contenuti",
        text:"A breve l'applicazione sarà disponibile, l'operazione può richiedere qualche minuto.",
        errorconn:{
            title:"Errore nel download",
            text:"Si è verificato un problema nello scaricamento, controlla la connessione e riprova"
        },
        alertannulla:{
            title:"Attenzione",
            text:"I contenuti non sono stati scaricati, l'applicazione può funzionare solo online. Riprova più tardi a scaricare per una migliore esperienza"
        }
    },
    main:{

        scan:"Scansiona QR Code",
        start:"Scansiona Silence Tag",
        stop:"Stop SilenceTag",
		alertApp:{
            title:"funzione non disponibile",
            text:"Questa funzione è disponibile solo in app",
        },
		timeoutTagTitle:"ATTENZIONE",
		timeoutTagText:"SilenceTag NON rilevato, potrebbe essere spento, utilizza il pulsante \"Scansiona QR Code\"",
		timeoutTagAccept:"Prosegui"
    },

    menu:{
        title:"Impostazioni",
        content:{
            title:"Aggiorna contenuti"
        },
        percorsi:{
            title:"Percorsi",
            subtitile:"Percorsi scaricati",
            add:"Cambia percorso",
            alert:"Attenzione questa operazione scaricherà i contenuti del nuovo percorso",
            select:"Percorsi attivi",
        },
        lang:{
            title:"Lingue",
            subtitile:"Lingue scaricate",
            add:"Aggiungi nuova lingua",
            select:"Contenuti disponibili",
            alert:"Attenzione questa operazione scaricherà i contenuti nella lingua scelta",
            it:"Italiano",
            en:"Inglese",
            fr:"Francese",
            de:"Tedesco",
            es:"Spagnolo"
        },
        help:"Aiuto",
        copyright:"Copyright e Privacy",
        privacy:"Privacy",
        termini:"Termini di servizio",
        test:{
            title:"Test",
            inizioTest:"Inizio TEST",
            stopTest:"Stop TEST",
            testoIstruzioni:"scollega le cuffie, alza il volume e esegui il test",
            compatibileTest:"Il dispositivo è compatibile",
            nonCompatibileTest:"Il dispositivo non è compatibile",
        }

    },
    raccolta:{
        title:"Raccolta",
        subtitle:"Rivivi l'esperienza",
        alerttext:"Non hai ancora aperto le schede. \n Alla fine del tour potrai rivedere qui le schede trovate lungo il percorso."
    }
   

}