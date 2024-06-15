import os
import warnings
warnings.filterwarnings("ignore")
from src.prompt import *
from pinecone import Pinecone
from langchain.chat_models import ChatOpenAI
from flask import Flask, render_template, request
from src.helper import download_hugging_face_embeddings
from src.prompt import prompt_template1
from langchain_pinecone import PineconeVectorStore
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from dotenv import load_dotenv




app = Flask(__name__)
#LOAD ENVIRONMENT VARIABLES
load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
PINECONE_API_ENV = os.environ.get('PINECONE_API_ENV')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

#Initializing the Pinecone
pinecone_instance = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV) 
index_name = "blogbot"


#Getting the embedding model
embeddings = download_hugging_face_embeddings()

#Accessing the stored embeddings
docsearch=PineconeVectorStore.from_existing_index(
    index_name, 
    embeddings
    )

#Crafting a prompt
PROMPT=PromptTemplate(
    template=prompt_template1, 
    input_variables=["context", "question"]
    )
chain_type_kwargs={"prompt": PROMPT}

#Defining which LLM to use
llm=ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    model_name="gpt-3.5-turbo", 
    temperature=0.5
    )

#Defining a from document retrieval chain
qa=RetrievalQA.from_chain_type(
    llm=llm, 
    chain_type="stuff", 
    retriever=docsearch.as_retriever(search_kwargs={'k': 2}),
    return_source_documents=True, 
    chain_type_kwargs=chain_type_kwargs
    )

#FLASK
@app.route("/")
def index():
    return render_template('chat.html')



@app.route("/get", methods=["GET", "POST"])
def chat():
    msg = request.form["msg"]
    input = msg
    print(input)
    result=qa({"query": input})
    return str(result["result"])



if __name__ == '__main__':
    app.run(host="0.0.0.0", port= 8080, debug= True)