package fr.emn.ose.queries;

import com.github.jmkgreen.morphia.query.Query;
import fr.emn.ose.stage.Stage;

/**
 * Created with IntelliJ IDEA.
 * User: Raoul
 * Date: 01/05/13
 * Time: 17:25
 * To change this template use File | Settings | File Templates.
 */
public class AvantageQuery extends StageQuery {

    /**
     * @param name The name of the field
     */
    public AvantageQuery(String name, Query query, Stage stage) throws ChampNullException {
        super(name, query, stage);
    }

    @Override
    protected String getChamp() {
        return this.stage.getAvantages();
    }

    @Override
    protected void setCriteria() {
        this.criteria = fieldEnd.containsIgnoreCase(this.getChamp());
    }


}
