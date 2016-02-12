package com.github.dirkraft.jerseyboot.web;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.github.dirkraft.jerseyboot.base.BaseJsonResource;
import com.google.common.base.Objects;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

@Path("/bpoints/")
public class FileCrawlerWeb extends BaseJsonResource {
	
	private static final String TOP = "___the_top_folder_please_dont_use_this_id";
	private static String rootFile = ".\\_TEST_DATA";
	
	public FileCrawlerWeb()
	{
		//rootFile = new File("").getAbsolutePath();
	}
	
	//http://localhost:6677/bpoints/folder/?path=___the_top_folder_please_dont_use_this_id&id=my_id
	@GET
	@Path("/folder")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getFolderPoints(@QueryParam("path") String path, @QueryParam("id") String id) 
	{
		String folderPath = TOP.equals(path) ? rootFile : path;
		File folder= new File(folderPath);
		List<Map<String,String>> folders = getListOfFoldersIn(folder);
		
		Map<Object,Object> result = new HashMap<Object, Object>();
		result.put("path", folder.getAbsolutePath());
		result.put("name", folder.getName());
		result.put("id", id);
		result.put("folders", folders);
		result.put("event_type", "list_folders");
		
		return Response.status(200).entity(result).build();
	}

	private List<Map<String,String>> getListOfFoldersIn(File folder) {
		File[] listFiles = folder.listFiles();
		List<Map<String,String>> folders = new ArrayList<Map<String, String>>();
		for (File file : listFiles) 
		{
			if(file.isDirectory())
			{
				Map<String, String> entry = new HashMap<>();
				entry.put("name", file.getName());
				entry.put("path", file.getAbsolutePath());
				folders.add(entry);
			}
		}
		return folders;
	}
	
	//http://localhost:6677/bpoints/text_list/?path=___the_top_folder_please_dont_use_this_id
	@GET
	@Path("/load_opened")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getOpenedList(@QueryParam("id") String id) 
	{
		File textFile = new File(rootFile +"/opened.json");
		Map<Object, Object> result = new HashMap<>();
		if(textFile.exists())
		{
			Map<Object, Object> contentsAsMap = Objects.firstNonNull(getMap(getContent(textFile.getAbsolutePath())), new HashMap<>());
			if(!contentsAsMap.isEmpty())
			{
				result.put("opened", contentsAsMap);
			}
		}
		result.put("id", id);
		return Response.status(200).entity(result).build();
	}

	@GET
	@Path("/text_list")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getTextList(@QueryParam("path") String path, @QueryParam("id") String id) 
	{
		Map<Object, Object> result = getTextohMessage(path, id);
		return Response.status(200).entity(result).build();
	}

	private Map<Object, Object> getTextohMessage(String path, String id) {
		Map<Object,Object> result = Objects.firstNonNull(getMap(getContent(path+"\\text.json")), new HashMap<>());
		List<Map<String,String>> folders = getListOfFoldersIn(new File(path));
		result.put("path", path);
		result.put("id", id);
		result.put("folder_list", folders);
		return result;
	}
	
	@POST
	@Path("/save_folder")
	@Consumes({"application/xml", "application/json"})
	@Produces({"application/xml", "application/json"})
	public Response saveFolder(Map<String,String> postData) 
	{
		File newFolder = new File(postData.get("path") +"/"+ postData.get("new_folder"));
		System.out.println("received a mkdir request :: " + newFolder.getAbsolutePath());
		boolean createdFolder = newFolder.mkdir();
		
		if(createdFolder)
		{
			Map<Object, Object> result = getTextohMessage(postData.get("path"), postData.get("id"));
			result.put("new_folder", postData.get("new_folder"));
			result.put("new_path", newFolder.getAbsolutePath());
			Gson gson = new Gson();
			return Response.status(200).entity(gson.toJson(result)).build();
		}
		else
		{
			System.out.println("DIDNT WORK");
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity("failed to create folder").build();
		}
    }
	
	@POST
	@Path("/save_text")
	@Consumes({"application/xml", "application/json"})
	@Produces({"application/xml", "application/json"})
	public Response saveTexts(Map<Object,Object> postData) 
	{
		File textFile = new File(postData.get("path") +"/text.json");
		System.out.println("saving text :: " + textFile.getAbsolutePath());
		
		Gson gson = new Gson();
		
		Map<Object,Object> result = new HashMap<>();
		result.put("text_list", postData.get("new_texts"));
		String json = gson.toJson(result);
		
		BufferedWriter writer;
		try{
        writer = new BufferedWriter(new FileWriter(textFile));
        writer.write(json);
        writer.close();  
		}
		catch(Exception e){
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity("failed to create text").build();
		}
		
		Map<Object, Object> actualResult = getTextohMessage((String)postData.get("path"), (String)postData.get("id"));
		actualResult.put("new_texts",postData.get("new_texts"));
		return Response.status(200).entity(gson.toJson(actualResult)).build();
    }
	
	@POST
	@Path("/save_opened")
	@Consumes({"application/xml", "application/json"})
	@Produces({"application/xml", "application/json"})
	public Response saveOpened(Map<Object,Object> postData) 
	{
		File textFile = new File(rootFile +"/opened.json");
		System.out.println("saving opened :: " + textFile.getAbsolutePath());
		
		Gson gson = new Gson();
		String json = gson.toJson(postData);
		
		BufferedWriter writer;
		try{
        writer = new BufferedWriter(new FileWriter(textFile));
        writer.write(json);
        writer.close();  
		}
		catch(Exception e){
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity("failed to create opened json").build();
		}
		
		return Response.status(200).build();
    }
	
//	public static List<Object> getList(Object jsonString) 
//	{
//		Gson gson = new Gson();
//		Type type = new TypeToken<List<Object>>(){}.getType();
//		List<Object> result = gson.fromJson(jsonString, type);
//		return result;
//	}
	
	public static Map<Object,Object> getMap(String jsonString) 
	{
		Gson gson = new Gson();
		Type type = new TypeToken<Map<Object, Object>>(){}.getType();
		Map<Object,Object> result = gson.fromJson(jsonString, type);
		return result;
	}
	
	private static String getContent(String fileName)
	{
		File fromFile = new File(fileName);
		try{

			String result = "";
			BufferedReader reader = new BufferedReader(new FileReader(fromFile));

	        String line = null;
	        while ((line=reader.readLine()) != null) {
	        	result+=line + "\n";
	        }

	        reader.close(); 
	        return result;
		}
		catch(Exception e)
		{
			System.out.println("empty folder/no file: " + fileName);
			//e.printStackTrace();
		}
		
		return "";
	}
	
	
}
